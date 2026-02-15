# backend/routers/admin.py
# ─────────────────────────────────────────────────────────────────────────────
# Admin router: list pending scans + approve (generates PDF + emails patient)
# + debug endpoint to diagnose empty dashboard
# ─────────────────────────────────────────────────────────────────────────────

from pathlib import Path
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.schema import Scan
from backend.models.user import User
from backend.security.jwt_handler import get_current_user
from backend.services.email_service import send_email_with_attachment
from backend.routers.reports import _load_template, _build_template_context

router = APIRouter(prefix="/admin", tags=["Admin"])

REPORTS_DIR = Path(__file__).parent.parent / "reports" / "temp"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# IMPORTANT: Status values must match what your pharmacist endpoint sets.
#
# Your schema.py default is "PENDING_AI".
# Check what your pharmacist.py sets when done — it should be "PHARMACIST_DONE".
# If it sets something else (e.g. "REVIEWED"), change PENDING_STATUS below.
# ─────────────────────────────────────────────────────────────────────────────
PENDING_STATUS  = "PHARMACIST_COMPLETED"   # matches pharmacist.py → scan.status = "PHARMACIST_COMPLETED"
APPROVED_STATUS = "REPORT_READY"      # status set after admin approves


# ── PDF generation ─────────────────────────────────────────────────────────
def _generate_pdf(scan: Scan, patient: User) -> tuple[bytes, str]:
    from weasyprint import HTML
    template = _load_template()
    context  = _build_template_context(scan, patient)
    html_str = template.render(**context)
    buf = BytesIO()
    HTML(string=html_str).write_pdf(buf)
    filename = f"Report_Scan_{scan.id}_P{str(patient.id).zfill(6)}.pdf"
    return buf.getvalue(), filename


# ── Background: save PDF to disk + email ───────────────────────────────────
def _background_send(pdf_bytes: bytes, filename: str, patient_email: str, scan_id: int):
    pdf_path = REPORTS_DIR / filename
    with open(pdf_path, "wb") as f:
        f.write(pdf_bytes)
    try:
        send_email_with_attachment(
            to_email=patient_email,
            subject=f"Your Diagnostic Report – Scan #{scan_id}",
            body=(
                "Dear Patient,\n\n"
                "Your diagnostic report is now ready. "
                "Please find it attached to this email.\n\n"
                "If you have any questions, contact your doctor.\n\n"
                "Regards,\nClinical Scan Support System\nAI Medical Center"
            ),
            attachment_bytes=pdf_bytes,
            attachment_filename=filename,
        )
    except Exception as e:
        print(f"[EMAIL ERROR] Scan {scan_id}: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# DEBUG ENDPOINT — remove or protect before production
# GET /admin/debug
# Returns: all scans with statuses + current user's role from JWT
# Use this to diagnose why the pending list is empty
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/debug")
def admin_debug(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Diagnostic endpoint — shows all scan statuses and your JWT role.
    Visit: GET /admin/debug  (with Bearer token in header)

    This tells you:
    1. What statuses your scans currently have
    2. Whether your token has role="admin"
    3. Whether any scans are in PHARMACIST_DONE status
    """
    all_scans = db.query(Scan).order_by(Scan.id.desc()).limit(20).all()

    # Count by status
    status_counts = {}
    for s in all_scans:
        status_counts[s.status] = status_counts.get(s.status, 0) + 1

    return {
        "your_role":          getattr(current_user, "role", "unknown"),
        "your_user_id":       current_user.id,
        "total_scans":        len(all_scans),
        "status_breakdown":   status_counts,
        "pending_filter":     PENDING_STATUS,
        "scans_in_pending":   sum(1 for s in all_scans if s.status == PENDING_STATUS),
        "recent_scans": [
            {
                "id":         s.id,
                "patient_id": s.patient_id,
                "status":     s.status,
                "prediction": s.prediction,
            }
            for s in all_scans[:10]
        ],
        "diagnosis": (
            f"✅ {sum(1 for s in all_scans if s.status == PENDING_STATUS)} scan(s) ready for admin approval."
            if any(s.status == PENDING_STATUS for s in all_scans)
            else (
                f"❌ No scans with status='{PENDING_STATUS}'. "
                f"Current statuses: {list(status_counts.keys())}. "
                f"Check that your pharmacist endpoint sets status='{PENDING_STATUS}' when done."
            )
        ),
    }


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/pending")
def admin_pending(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all scans that completed the full workflow and await final approval."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")

    scans = (
        db.query(Scan)
        .filter(Scan.status == PENDING_STATUS)
        .order_by(Scan.id.desc())
        .all()
    )

    return [
        {
            "id":               s.id,
            "patient_id":       s.patient_id,
            "prediction":       s.prediction,
            "confidence":       s.confidence,
            "doctor_notes":     s.doctor_notes,
            "pharmacist_notes": s.pharmacist_notes,
            "status":           s.status,
            "created_at":       s.created_at,
        }
        for s in scans
    ]


@router.post("/approve/{scan_id}")
def approve_report(
    scan_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Admin approves a scan:
      1. Validates scan exists and is PHARMACIST_DONE
      2. Generates PDF from HTML template
      3. Commits status → REPORT_READY
      4. Background: saves PDF + emails patient
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")

    scan: Scan | None = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    if scan.status == APPROVED_STATUS:
        raise HTTPException(status_code=400, detail="Report already approved.")

    patient: User | None = db.query(User).filter(User.id == scan.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found.")
    if not patient.email:
        raise HTTPException(status_code=422, detail="Patient has no email address on file.")

    # Generate PDF before committing — fail fast if template broken
    try:
        pdf_bytes, filename = _generate_pdf(scan, patient)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    # Commit approval
    scan.status = APPROVED_STATUS
    db.commit()
    db.refresh(scan)

    # Non-blocking background: save + email
    background_tasks.add_task(
        _background_send,
        pdf_bytes=pdf_bytes,
        filename=filename,
        patient_email=patient.email,
        scan_id=scan.id,
    )

    return {
        "message":  f"Report approved. PDF is being emailed to {patient.email}.",
        "scan_id":  scan.id,
        "status":   scan.status,
        "filename": filename,
    }