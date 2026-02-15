from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from backend.database import get_db
from backend.models import User
from backend.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    role:     str = "patient"


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    allowed = {"patient", "doctor", "pharmacist", "admin"}
    if req.role not in allowed:
        raise HTTPException(400, "Invalid role")
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(400, "Email already registered")
    user = User(
        name=req.name,
        email=req.email,
        password=hash_password(req.password),
        role=req.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registered successfully", "user_id": user.id, "role": user.role}


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email, User.is_active == True).first()
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(401, "Invalid email or password")

    # Admin requires OTP — return a pre-token flag
    if user.role == "admin":
        # Return a short-lived pre-auth token without full access
        token = create_access_token({"user_id": user.id, "email": user.email, "role": user.role, "otp_required": True})
        return {"access_token": token, "otp_required": True, "email": user.email, "name": user.name}

    token = create_access_token({"user_id": user.id, "email": user.email, "role": user.role})
    return {"access_token": token, "otp_required": False, "role": user.role, "name": user.name}
