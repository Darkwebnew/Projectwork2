# backend/security/role_guard.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.security.jwt_handler import verify_token

security = HTTPBearer()


def require_role(required_role: str):

    def role_checker(credentials: HTTPAuthorizationCredentials = Depends(security)):

        token = credentials.credentials

        payload = verify_token(token)

        if payload is None:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        if payload.get("role") != required_role:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return payload

    return role_checker
