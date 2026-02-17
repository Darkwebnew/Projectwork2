# backend\models\__init__.py

from .user import User
from .schema import Scan
from .otp import OTPRecord

__all__ = [
    "User",
    "Scan",
    "OTPRecord"
]
