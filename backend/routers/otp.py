# backend/routers/otp.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import random
import os
from backend.database import get_db
from backend.models import OTPRecord, User
from backend.services.email_service import send_otp_email
from backend.security import create_access_token

router = APIRouter(prefix="/otp", tags=["OTP"])

OTP_EXPIRE = int(os.getenv("OTP_EXPIRE_MINUTES", "10"))


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


class SendOTPRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp:   str


@router.post("/send")
def send_otp(req: SendOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email, User.role == "admin").first()
    if not user:
        raise HTTPException(404, "Admin account not found")

    # Invalidate old OTPs for this email
    db.query(OTPRecord).filter(OTPRecord.email == req.email, OTPRecord.used == False).update({"used": True})
    db.commit()

    otp = generate_otp()
    expires = datetime.utcnow() + timedelta(minutes=OTP_EXPIRE)
    record = OTPRecord(email=req.email, otp=otp, expires_at=expires)
    db.add(record)
    db.commit()

    send_otp_email(req.email, otp, user.name)
    return {"message": f"OTP sent to {req.email}", "expires_in_minutes": OTP_EXPIRE}


@router.post("/verify")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    record = db.query(OTPRecord).filter(
        OTPRecord.email == req.email,
        OTPRecord.otp   == req.otp,
        OTPRecord.used  == False,
    ).order_by(OTPRecord.created_at.desc()).first()

    if not record:
        raise HTTPException(400, "Invalid OTP")
    if datetime.utcnow() > record.expires_at:
        record.used = True
        db.commit()
        raise HTTPException(400, "OTP has expired. Please request a new one.")

    record.used = True
    db.commit()

    user = db.query(User).filter(User.email == req.email).first()
    token = create_access_token({"user_id": user.id, "email": user.email, "role": user.role})
    return {"access_token": token, "role": user.role, "name": user.name, "message": "OTP verified"}
