# backend/routers/reports.py
# ─────────────────────────────────────────────────────────────────────────────
# Reports router: on-demand PDF download endpoint
# These helpers (_load_template, _build_template_context) are also imported
# by admin.py so there is a single source of truth for PDF generation.
#
# Endpoint: GET /reports/pdf/{scan_id}
#   Requires: Bearer JWT token
#   Access:
#     - admin / doctor / pharmacist → any REPORT_READY scan
#     - patient → only their own REPORT_READY scan
# ─────────────────────────────────────────────────────────────────────────────

import base64
from io import BytesIO
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from jinja2 import Environment, FileSystemLoader, select_autoescape

from backend.database import get_db
from backend.models.schema import Scan
from backend.models.user import User
from backend.security.jwt_handler import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
UPLOADS_DIR  = Path(__file__).parent.parent / "uploads" / "patient_scans"


# ── Template loader ────────────────────────────────────────────────────────
def _load_template():
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATE_DIR)),
        autoescape=select_autoescape(["html"]),
    )
    return env.get_template("report_template.html")


# ── Helpers ────────────────────────────────────────────────────────────────
def _encode_scan_image(filename: str | None) -> str | None:
    if not filename:
        return None
    path = UPLOADS_DIR / filename
    if not path.exists():
        return None
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def _risk_level(confidence: float | None, prediction: str | None) -> str:
    if prediction == "Normal":
        return "Low"
    if confidence is None:
        return "Unknown"
    if confidence >= 0.90:
        return "High"
    if confidence >= 0.70:
        return "Moderate"
    return "Low-Moderate"


def _build_template_context(scan: Scan, patient: User) -> dict:
    """
    Maps DB fields → Jinja2 template variables.
    Both reports.py (download) and admin.py (approve+email) use this.
    Add fields here as your model grows.
    """
    now     = datetime.now()
    scan_dt = scan.created_at or now

    confidence_pct = (
        f"{round(scan.confidence * 100, 2)}" if scan.confidence is not None else "N/A"
    )

    return {
        # ── Report meta ──────────────────────────────────
        "report_id":   f"2026-{str(scan.id).zfill(5)}",
        "report_date": now.strftime("%d-%m-%Y"),
        "report_time": now.strftime("%I:%M %p"),
        "scan_id":     scan.id,

        # ── Patient ──────────────────────────────────────
        "patient_name":      getattr(patient, "full_name", None) or getattr(patient, "name", None) or getattr(patient, "username", "—"),
        "patient_id":        str(patient.id).zfill(6),
        "age":               getattr(patient, "age",               "—"),
        "gender":            getattr(patient, "gender",            "—"),
        "dob":               getattr(patient, "date_of_birth",     "—"),
        "blood_group":       getattr(patient, "blood_group",       "—"),
        "phone":             getattr(patient, "phone",             "—"),
        "email":             getattr(patient, "email",             "—"),
        "address":           getattr(patient, "address",           "—"),
        "emergency_contact": getattr(patient, "emergency_contact", "—"),

        # ── Referral ─────────────────────────────────────
        "referring_doctor":    "—",
        "department":          "Radiology",
        "hospital":            "AI Medical Center",
        "clinical_indication": "—",
        "priority":            "Normal",
        "insurance":           "—",

        # ── Scan ─────────────────────────────────────────
        "scan_type":     getattr(scan, "scan_type",  "CT Scan"),
        "body_part":     getattr(scan, "body_part",  "Chest"),
        "scan_date":     scan_dt.strftime("%d-%m-%Y"),
        "scan_time":     scan_dt.strftime("%I:%M %p"),
        "machine":       getattr(scan, "machine",    "—"),
        "technician":    getattr(scan, "technician", "—"),
        "contrast_used": getattr(scan, "contrast",   "No"),
        "scan_quality":  getattr(scan, "quality",    "Good"),

        # ── AI results ────────────────────────────────────
        "ai_model":        "MobileNetV2",
        "ai_version":      "v3.0",
        "prediction":      scan.prediction or "—",
        "confidence":      confidence_pct,
        "risk_level":      _risk_level(scan.confidence, scan.prediction),
        "processing_time": getattr(scan, "processing_time", "—"),

        # ── Clinical ──────────────────────────────────────
        "doctor_notes":  scan.doctor_notes or "No findings recorded.",
        "impression":    "Based on AI analysis and clinical review.",
        "recommendations": [
            "Routine follow-up if symptoms persist.",
            "Consult physician if discomfort continues.",
            "No immediate treatment required."
            if scan.prediction == "Normal"
            else "Please follow the prescribed treatment plan.",
        ],
        "prescription": scan.pharmacist_notes or "",

        # ── Signatories ───────────────────────────────────
        "doctor_name":          getattr(scan, "doctor_name",          "Attending Physician"),
        "doctor_qualification": getattr(scan, "doctor_qualification", "MD Radiology"),
        "pharmacist_name":      getattr(scan, "pharmacist_name",      "Pharmacist"),

        # ── Scan image (base64) ───────────────────────────
        "scan_image_base64": _encode_scan_image(getattr(scan, "image_filename", None)),
    }


# ── Endpoint ───────────────────────────────────────────────────────────────
@router.get("/pdf/{scan_id}", summary="Download diagnostic report as PDF")
def download_report_pdf(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from weasyprint import HTML

    scan: Scan | None = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")

    if scan.status != "REPORT_READY":
        raise HTTPException(
            status_code=403,
            detail="Report not yet approved. PDF is only available for REPORT_READY scans.",
        )

    if current_user.role == "patient" and scan.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied.")

    patient: User | None = db.query(User).filter(User.id == scan.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found.")

    template = _load_template()
    context  = _build_template_context(scan, patient)
    html_str = template.render(**context)

    buf = BytesIO()
    HTML(string=html_str).write_pdf(buf)
    buf.seek(0)

    filename = f"Report_Scan_{scan_id}_P{str(patient.id).zfill(6)}.pdf"
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename={filename}"},
    )