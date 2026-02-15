from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from backend.database import Base


class OTPRecord(Base):

    __tablename__ = "otp_records"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, nullable=False, index=True)

    otp = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    expires_at = Column(DateTime, nullable=False)

    used = Column(Boolean, default=False)
