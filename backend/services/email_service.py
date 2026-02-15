# backend/services/email_service.py
# ─────────────────────────────────────────────────────────────────────────────
# Central email helper for the Clinical Scan Support System.
#
# Functions exported:
#   send_otp_email(to_email, otp_code)         ← routers/otp.py
#   send_plain_email(to_email, subject, body)  ← generic notifications
#   send_email_with_attachment(...)            ← routers/admin.py (report PDF)
#
# .env config:
#   SMTP_HOST=smtp.gmail.com
#   SMTP_PORT=587
#   SMTP_USER=your_hospital@gmail.com
#   SMTP_PASSWORD=your_16char_app_password     ← Gmail App Password, NOT account password
#   EMAIL_FROM=Clinical Scan Support System <your_hospital@gmail.com>
#
# Gmail App Password setup:
#   1. Enable 2-Factor Auth on your Google account
#   2. Google Account → Security → App Passwords → Mail → Generate
#   3. Use the 16-char password as SMTP_PASSWORD
# ─────────────────────────────────────────────────────────────────────────────

import os
import smtplib
from email.message import EmailMessage

SMTP_HOST     = os.getenv("SMTP_HOST",     "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER     = os.getenv("SMTP_USER",     "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
EMAIL_FROM    = os.getenv("EMAIL_FROM",    SMTP_USER)


def _smtp() -> smtplib.SMTP:
    """Open, authenticate, and return an SMTP connection."""
    if not SMTP_USER or not SMTP_PASSWORD:
        raise ValueError(
            "SMTP credentials not configured. "
            "Set SMTP_USER and SMTP_PASSWORD in your .env file."
        )
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login(SMTP_USER, SMTP_PASSWORD)
    return server


# ── 1. OTP email ──────────────────────────────────────────────────────────────
def send_otp_email(to_email: str, otp_code: str) -> None:
    """
    Send a one-time password to the patient/user.
    Called by routers/otp.py.
    """
    send_plain_email(
        to_email=to_email,
        subject="Your OTP Code – Clinical Scan Support System",
        body=(
            f"Your one-time password (OTP) is:\n\n"
            f"    {otp_code}\n\n"
            f"This code expires in 5 minutes.\n\n"
            f"If you did not request this, please ignore this email.\n\n"
            f"Regards,\nClinical Scan Support System"
        ),
    )


# ── 2. Plain text email ───────────────────────────────────────────────────────
def send_plain_email(to_email: str, subject: str, body: str) -> None:
    """
    Send a plain-text email with no attachments.
    Used for OTPs, status notifications, etc.
    """
    msg            = EmailMessage()
    msg["Subject"] = subject
    msg["From"]    = EMAIL_FROM
    msg["To"]      = to_email
    msg.set_content(body)

    with _smtp() as server:
        server.send_message(msg)

    print(f"[EMAIL] Sent to {to_email} | {subject}")


# ── 3. Email with file attachment ─────────────────────────────────────────────
def send_email_with_attachment(
    to_email: str,
    subject: str,
    body: str,
    attachment_bytes: bytes,
    attachment_filename: str,
    content_type: str = "application/pdf",
) -> None:
    """
    Send an email with a single file attachment.
    Called by routers/admin.py when approving a diagnostic report.

    Args:
        to_email:            Recipient email address.
        subject:             Email subject line.
        body:                Plain-text body.
        attachment_bytes:    Raw bytes of the file (e.g. PDF).
        attachment_filename: Filename shown to the recipient.
        content_type:        MIME type string (default 'application/pdf').
    """
    msg            = EmailMessage()
    msg["Subject"] = subject
    msg["From"]    = EMAIL_FROM
    msg["To"]      = to_email
    msg.set_content(body)

    maintype, subtype = content_type.split("/", 1)
    msg.add_attachment(
        attachment_bytes,
        maintype=maintype,
        subtype=subtype,
        filename=attachment_filename,
    )

    with _smtp() as server:
        server.send_message(msg)

    print(f"[EMAIL] Report emailed to {to_email} | {attachment_filename}")