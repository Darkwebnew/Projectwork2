# backend/security/jwt_handler.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User

# ── JWT config ──────────────────────────────────────────────────────────────
SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_THIS"   # ← change before production
ALGORITHM  = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ── Create access token ──────────────────────────────────────────────────────
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire    = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ── Verify JWT (returns payload dict or None) ────────────────────────────────
def verify_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


# ── Get current user — fetches full row from DB including role ───────────────
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Decode the JWT, extract user_id, then fetch the full User row from the DB.
    This ensures current_user.role, current_user.email, etc. are all available.

    Previously this returned User(id=user_id) — a dummy object with no role —
    which caused every role check (current_user.role != "admin") to fail with 403.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = verify_token(token)
    if payload is None:
        raise credentials_exception

    # Support both "user_id" and "sub" as the ID claim
    user_id = payload.get("user_id") or payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload — no user_id or sub claim",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch the actual user from the database
    user: User | None = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user   # ← full User object: .id, .name, .email, .role all populated