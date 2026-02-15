import smtplib
from email.message import EmailMessage
from pathlib import Path
from weasyprint import HTML
from fastapi import HTTPException
from backend.models.user import User
from backend.models.schema import Scan
from backend.database import get_db
from sqlalchemy.orm import Session
from backend.routers.admin import router

REPORTS_DIR = Path(__file__).parent.parent / "reports" / "temp"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def send_email_with_pdf(to_email: str, subject: str, body: str, pdf_path: Path):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = "your_email@example.com"  # Replace with your email
    msg['To'] = to_email
    msg.set_content(body)

    with open(pdf_path, 'rb') as f:
        pdf_data = f.read()
    msg.add_attachment(pdf_data, maintype='application', subtype='pdf', filename=pdf_path.name)

    # Use SMTP server
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:  # Gmail example
        smtp.login("your_email@example.com", "your_app_password")  # app password if Gmail
        smtp.send_message(msg)

def approve_report(scan_id: int, db: Session):
    scan: Scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(404, "Scan not found")

    # Mark report as approved
    scan.status = "REPORT_READY"
    db.commit()

    # Fetch patient
    patient: User = db.query(User).filter(User.id == scan.patient_id).first()
    if not patient or not patient.email:
        raise HTTPException(404, "Patient not found or has no email")

    # Build PDF (same as your /reports/pdf endpoint)
    from backend.routers.reports_router import _load_template, _build_template_context

    template = _load_template()
    context = _build_template_context(scan, patient)
    html_str = template.render(**context)

    # Save PDF to disk
    pdf_path = REPORTS_DIR / f"Report_Scan_{scan.id}_P{str(patient.id).zfill(6)}.pdf"
    HTML(string=html_str).write_pdf(pdf_path)

    # Send PDF via email
    send_email_with_pdf(
        to_email=patient.email,
        subject=f"Your Scan Report #{scan.id}",
        body="Dear patient,\n\nYour scan report is ready. Please find it attached.\n\nRegards,\nClinical Scan Support System",
        pdf_path=pdf_path
    )

    return {"message": f"Report approved and sent to {patient.email}"}
