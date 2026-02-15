from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.schema import Scan

router = APIRouter(
    prefix="/pharmacist",
    tags=["Pharmacist"]
)


@router.get("/queue")
def pharmacist_queue(
    db: Session = Depends(get_db)
):

    return db.query(Scan).filter(

        Scan.status == "DOCTOR_VERIFIED"

    ).all()


@router.post("/complete/{scan_id}")
def complete_prescription(

    scan_id: int,

    notes: str = Form(...),

    db: Session = Depends(get_db)

):

    scan = db.query(Scan).filter(

        Scan.id == scan_id

    ).first()

    if not scan:

        raise HTTPException(404, "Scan not found")

    scan.pharmacist_notes = notes

    scan.status = "PHARMACIST_COMPLETED"

    db.commit()

    return {

        "message": "Prescription completed",

        "status": scan.status

    }