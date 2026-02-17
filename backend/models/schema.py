# backend\models\schema.py

from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from backend.database import Base


class Scan(Base):

    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, nullable=False)

    file_path = Column(String, nullable=False)

    prediction = Column(String, nullable=True)

    confidence = Column(Float, nullable=True)

    doctor_notes = Column(Text, nullable=True)

    pharmacist_notes = Column(Text, nullable=True)

    status = Column(String, default="PENDING_AI")

    created_at = Column(DateTime, default=datetime.utcnow)
