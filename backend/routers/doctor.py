import logging
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.schema import Scan
from backend.services.ai_service import predict_scan
from backend.config import BASE_DIR

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/doctor",
    tags=["Doctor"]
)


# ─────────────────────────────────────────────────────────────
# Helper: Resolve stored relative path → absolute filesystem path
# ─────────────────────────────────────────────────────────────

def resolve_scan_path(relative_path: str) -> Path:
    """
    Convert DB stored relative path
    (e.g. uploads/patient_scans/abc.jpg)
    into an absolute path from project root.
    """
    p = Path(relative_path)
    if p.is_absolute():
        return p
    return BASE_DIR / p


# ─────────────────────────────────────────────────────────────
# Get Workqueue (all scans)
# ─────────────────────────────────────────────────────────────

@router.get("/pending")
def get_pending_scans(db: Session = Depends(get_db)):
    return db.query(Scan).all()


# ─────────────────────────────────────────────────────────────
# Run AI Analysis
# ─────────────────────────────────────────────────────────────

@router.post("/analyze/{scan_id}")
def analyze_scan(scan_id: int, db: Session = Depends(get_db)):

    scan = db.query(Scan).filter(Scan.id == scan_id).first()

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    abs_path = resolve_scan_path(scan.file_path)

    logger.info(
        f"[AI] scan_id={scan_id} | "
        f"stored='{scan.file_path}' | "
        f"resolved='{abs_path}' | "
        f"exists={abs_path.exists()}"
    )

    if not abs_path.exists():
        raise HTTPException(
            status_code=400,
            detail=(
                "Scan file not found on disk. "
                f"Stored path: {scan.file_path}"
            )
        )

    # Run AI safely
    try:
        result = predict_scan(str(abs_path))
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("AI prediction failed")
        raise HTTPException(
            status_code=500,
            detail=f"AI prediction failed: {type(e).__name__}"
        )

    if not result or "label" not in result or "confidence" not in result:
        raise HTTPException(
            status_code=500,
            detail="AI returned unexpected result format"
        )

    scan.prediction = result["label"]
    scan.confidence = result["confidence"]
    scan.status = "AI_ANALYZED"

    db.commit()
    db.refresh(scan)

    return {
        "message": "AI analysis complete",
        "status": scan.status,
        "prediction": scan.prediction,
        "confidence": scan.confidence,
    }


# ─────────────────────────────────────────────────────────────
# Doctor Verification (FIXED VERSION)
# ─────────────────────────────────────────────────────────────

@router.post("/verify/{scan_id}")
async def doctor_verify(
    scan_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Receives FormData from frontend:
    - notes (required)
    """

    form = await request.form()
    notes = form.get("notes")

    if not notes or not notes.strip():
        raise HTTPException(
            status_code=400,
            detail="Clinical notes are required"
        )

    scan = db.query(Scan).filter(Scan.id == scan_id).first()

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    if scan.status not in ("AI_ANALYZED", "DOCTOR_VERIFIED"):
        raise HTTPException(
            status_code=400,
            detail="Scan must be AI-analysed before verification"
        )

    scan.doctor_notes = notes.strip()
    scan.status = "DOCTOR_VERIFIED"

    db.commit()
    db.refresh(scan)

    return {
        "message": "Doctor verification complete",
        "status": scan.status,
        "notes": scan.doctor_notes
    }


# ─────────────────────────────────────────────────────────────
# Debug Path Endpoint (remove before production)
# ─────────────────────────────────────────────────────────────

@router.get("/debug/scan/{scan_id}/path")
def debug_scan_path(scan_id: int, db: Session = Depends(get_db)):

    scan = db.query(Scan).filter(Scan.id == scan_id).first()

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    resolved = resolve_scan_path(scan.file_path)

    return {
        "scan_id": scan_id,
        "stored_path": scan.file_path,
        "resolved_path": str(resolved),
        "exists": resolved.exists(),
        "base_dir": str(BASE_DIR),
    }
