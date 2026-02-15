import os
import uuid
import shutil

from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.schema import Scan
from backend.config import UPLOAD_DIR

router = APIRouter(
    prefix="/patient",
    tags=["Patient"]
)


@router.post("/upload")
def upload_scan(
    patient_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # ── Validate extension ─────────────────────────────────────────────────────
    allowed = {".jpg", ".jpeg", ".png"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(400, detail=f"Unsupported file type '{ext}'. Allowed: jpg, jpeg, png")

    # ── Save to absolute path ──────────────────────────────────────────────────
    filename      = f"{uuid.uuid4()}{ext}"
    absolute_path = UPLOAD_DIR / filename          # pathlib handles slashes on any OS

    with open(absolute_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ── Store RELATIVE path in DB (always forward slashes) ────────────────────
    relative_path = f"uploads/patient_scans/{filename}"

    scan = Scan(
        patient_id=patient_id,
        file_path=relative_path,
        status="PENDING_AI"
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "message":   "Scan uploaded successfully",
        "scan_id":   scan.id,
        "status":    scan.status,
        "file_path": relative_path,
    }


@router.get("/status/{patient_id}")
def patient_status(
    patient_id: int,
    db: Session = Depends(get_db)
):
    scans = db.query(Scan).filter(Scan.patient_id == patient_id).all()
    return scans