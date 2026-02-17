# backend/routers/auth_router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User

from backend.schemas.user_schema import UserCreate, UserLogin, TokenResponse

from backend.security.password import hash_password, verify_password
from backend.security.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:

        raise HTTPException(400, "Email exists")

    new_user = User(

        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created"}


@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        raise HTTPException(401, "Invalid email")

    if not verify_password(
        user.password,
        db_user.password
    ):

        raise HTTPException(401, "Invalid password")

    token = create_access_token({

        "user_id": db_user.id,
        "role": db_user.role,
        "email": db_user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
