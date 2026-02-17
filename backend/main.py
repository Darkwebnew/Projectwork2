# backend/main.py

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import patient
from backend.routers import doctor
from backend.routers import pharmacist
from backend.routers import admin
from backend.routers import auth_router
from backend.routers import otp
from backend.routers import chatbot
from backend.routers import auth
from backend.routers import reports

# Ensure upload directory exists before any request hits
os.makedirs("uploads/patient_scans", exist_ok=True)

app = FastAPI(
    title="Clinical Scan Support System",
    version="FINAL"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():

    return {
        "message": "CSSS Backend FINAL Running"
    }


app.include_router(auth_router.router)
app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(pharmacist.router)
app.include_router(admin.router)
app.include_router(otp.router)
app.include_router(chatbot.router)
app.include_router(auth.router)
app.include_router(reports.router)
