# backend/routers/chatbot.py

import logging
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel, validator

# ── Logger ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [CHATBOT] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("chatbot")

# ── Router ────────────────────────────────────────────────────────────────────
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# ── Session Context (in-memory; swap for Redis in production) ─────────────────
SESSION_CONTEXT: dict[str, dict] = {}

# ── Knowledge Base ────────────────────────────────────────────────────────────
KB: dict[str, dict] = {
    "pneumonia": {
        "answer": (
            "🫁 **Pneumonia** is a lung infection that inflames the air sacs.\n\n"
            "**Symptoms:** Cough, fever, chills, shortness of breath, chest pain.\n\n"
            "**Treatment:** Antibiotics (bacterial) or antivirals (viral), rest, and fluids.\n\n"
            "If the AI detected pneumonia in your scan, please consult your assigned doctor immediately."
        ),
        "category": "medical",
        "keywords": ["pneumonia", "lung infection", "chest infection", "lungs", "bacterial", "viral"],
    },
    "normal": {
        "answer": (
            "✅ **Normal Scan Result** means the AI found no significant abnormalities.\n\n"
            "This is a preliminary AI result — your doctor will review and verify it before the final report is issued.\n\n"
            "You will receive a notification when your report is ready."
        ),
        "category": "result",
        "keywords": ["normal", "clear", "no abnormality", "healthy", "negative"],
    },
    "upload": {
        "answer": (
            "📤 **How to Upload a Scan:**\n\n"
            "1. Login as a patient\n"
            "2. Go to your **Dashboard**\n"
            "3. Click **'Upload Scan'**\n"
            "4. Choose a CT, MRI, or X-ray image (JPG or PNG)\n"
            "5. Click **Submit**\n\n"
            "Your doctor will be notified automatically after upload."
        ),
        "category": "workflow",
        "keywords": ["upload", "submit scan", "add scan", "send scan", "how to upload"],
    },
    "status": {
        "answer": (
            "🔄 **Scan Status Flow:**\n\n"
            "• **PENDING_AI** — Scan uploaded, awaiting AI analysis\n"
            "• **AI_ANALYZED** — AI has processed the scan\n"
            "• **DOCTOR_VERIFIED** — Doctor reviewed and added notes\n"
            "• **PHARMACIST_COMPLETED** — Pharmacist added prescription notes\n"
            "• **REPORT_READY** — Final report available for download\n\n"
            "Track your scan progress on your Patient Dashboard."
        ),
        "category": "workflow",
        "keywords": ["status", "progress", "stage", "pending", "analyzed", "verified", "completed", "ready"],
    },
    "report": {
        "answer": (
            "📋 **Your Report:**\n\n"
            "Your report is available when the scan status shows **REPORT_READY**.\n\n"
            "You will receive an **email notification** when the admin approves it.\n\n"
            "You can also download it from your Patient Dashboard at any time after approval."
        ),
        "category": "workflow",
        "keywords": ["report", "result", "download", "view result", "final report"],
    },
    "doctor": {
        "answer": (
            "🩺 **Doctor's Role:**\n\n"
            "Doctors review AI predictions and add clinical notes to verify scans.\n\n"
            "After verification, the scan moves to **DOCTOR_VERIFIED** status and is forwarded to the pharmacist.\n\n"
            "Doctors can reject or request a re-upload if the scan quality is insufficient."
        ),
        "category": "workflow",
        "keywords": ["doctor", "physician", "verify", "clinical notes", "doctor review"],
    },
    "pharmacist": {
        "answer": (
            "💊 **Pharmacist's Role:**\n\n"
            "Pharmacists review doctor-verified scans and add prescription notes.\n\n"
            "After the pharmacist completes their review, the report is forwarded to the admin for final approval."
        ),
        "category": "workflow",
        "keywords": ["pharmacist", "prescription", "medicine", "medication", "drug"],
    },
    "admin": {
        "answer": (
            "🔐 **Admin Role:**\n\n"
            "Admins review completed reports and **approve or reject** them.\n\n"
            "Admin login requires **two-step verification** (OTP sent to your registered email).\n\n"
            "Admins also manage user accounts, roles, and system settings."
        ),
        "category": "admin",
        "keywords": ["admin", "administrator", "approve", "reject", "manage"],
    },
    "otp": {
        "answer": (
            "🔑 **OTP Verification:**\n\n"
            "• A **6-digit OTP** is sent to your registered admin email at login.\n"
            "• The OTP expires in **10 minutes**.\n"
            "• Check your **spam/junk folder** if you don't see it.\n"
            "• Click **Resend OTP** on the login page if needed.\n\n"
            "Contact your system administrator if you continue to have issues."
        ),
        "category": "auth",
        "keywords": ["otp", "one time password", "verification code", "2fa", "two step", "code", "resend"],
    },
    "ai": {
        "answer": (
            "🤖 **AI Analysis:**\n\n"
            "Our AI model analyzes CT, MRI, and X-ray scans using **TensorFlow**.\n\n"
            "It provides:\n"
            "• A **prediction** — Normal or Pneumonia\n"
            "• A **confidence score** — percentage certainty\n\n"
            "AI results are always reviewed by a doctor before being included in your final report."
        ),
        "category": "ai",
        "keywords": ["ai", "artificial intelligence", "machine learning", "model", "tensorflow", "prediction", "confidence"],
    },
    "ct": {
        "answer": (
            "🖥️ **CT Scans (Computed Tomography):**\n\n"
            "CT scans provide detailed cross-sectional images of the body.\n\n"
            "• Upload CT scans as **JPG or PNG**\n"
            "• Our AI is optimized for chest CT analysis\n"
            "• Accepted max size: 10MB per file"
        ),
        "category": "scan",
        "keywords": ["ct", "computed tomography", "ct scan", "cat scan"],
    },
    "mri": {
        "answer": (
            "🧲 **MRI Scans (Magnetic Resonance Imaging):**\n\n"
            "MRI uses magnetic fields to produce detailed images of organs and soft tissues.\n\n"
            "• Upload MRI images as **JPG or PNG**\n"
            "• Accepted max size: 10MB per file"
        ),
        "category": "scan",
        "keywords": ["mri", "magnetic resonance", "mri scan"],
    },
    "xray": {
        "answer": (
            "☢️ **X-Ray Scans:**\n\n"
            "X-rays are commonly used for lung screening and chest analysis.\n\n"
            "• Our AI model is **optimized for chest X-rays** for pneumonia detection\n"
            "• Upload as **JPG or PNG**\n"
            "• Accepted max size: 10MB per file"
        ),
        "category": "scan",
        "keywords": ["xray", "x-ray", "x ray", "radiograph", "chest xray"],
    },
    "password": {
        "answer": (
            "🔒 **Password Requirements:**\n\n"
            "• Minimum **6 characters**\n"
            "• Mix of letters, numbers, and symbols recommended\n\n"
            "**Forgot your password?** Contact your system administrator for a reset."
        ),
        "category": "auth",
        "keywords": ["password", "forgot password", "reset password", "change password"],
    },
    "login": {
        "answer": (
            "🔓 **How to Login:**\n\n"
            "1. Go to the **Login page**\n"
            "2. Enter your **email and password**\n"
            "3. Click **Login**\n"
            "4. *(Admin only)* Enter the **OTP** sent to your email\n\n"
            "Make sure cookies are enabled in your browser."
        ),
        "category": "auth",
        "keywords": ["login", "sign in", "log in", "access", "enter"],
    },
    "register": {
        "answer": (
            "📝 **How to Register:**\n\n"
            "1. Click **'Create Account'** on the login page\n"
            "2. Fill in your **name, email, and password**\n"
            "3. Select your **role** (Patient, Doctor, Pharmacist)\n"
            "4. Click **Submit**\n\n"
            "⚠️ *Admin accounts are created only by existing admins.*"
        ),
        "category": "auth",
        "keywords": ["register", "sign up", "create account", "new account", "join"],
    },
    "contact": {
        "answer": (
            "📞 **Need Help?**\n\n"
            "• **Technical issues** → Contact your system administrator\n"
            "• **Medical concerns** → Consult your assigned doctor directly\n"
            "• **Report issues** → Use the feedback form in your dashboard\n\n"
            "We're here to help!"
        ),
        "category": "support",
        "keywords": ["contact", "support", "help", "issue", "problem", "feedback", "complaint"],
    },
    "format": {
        "answer": (
            "🖼️ **Accepted File Formats:**\n\n"
            "• **JPG / JPEG** — recommended\n"
            "• **PNG** — accepted\n"
            "• Max file size: **10MB**\n\n"
            "DICOM files are not yet supported. Convert to JPG/PNG before uploading."
        ),
        "category": "scan",
        "keywords": ["format", "file type", "jpg", "png", "jpeg", "dicom", "file format", "accepted"],
    },
}

# ── Greetings ──────────────────────────────────────────────────────────────────
GREETINGS = {
    "hello", "hi", "hey", "help", "greetings",
    "good morning", "good afternoon", "good evening",
    "howdy", "what's up", "sup",
}

FALLBACK = (
    "🤔 I'm not sure about that. I can help with:\n\n"
    "• **Scan upload** — how to upload scans\n"
    "• **Scan status** — understanding your report status\n"
    "• **AI results** — what predictions mean\n"
    "• **Workflow** — patient → doctor → pharmacist → admin\n"
    "• **CT / MRI / X-ray** — scan type information\n"
    "• **Login / OTP / Register** — authentication help\n"
    "• **Report** — downloading your final report\n\n"
    "Try asking about one of these, or contact your administrator for further help."
)


# ── Core NLP ───────────────────────────────────────────────────────────────────
def find_answer(message: str, session_id: str = "default") -> tuple[str, str]:
    """
    Returns (answer_text, matched_category).
    Matching priority:
      1. Greeting check
      2. Exact keyword match in message
      3. Partial / substring match across all keywords
      4. Fallback
    """
    msg = message.lower().strip()

    # 1 — Greeting
    if any(g in msg for g in GREETINGS):
        return (
            "👋 Hello! I'm the **CSSS Medical Assistant**.\n\n"
            "I can help you with scan uploads, results, workflow questions, and system navigation.\n\n"
            "What would you like to know?",
            "greeting",
        )

    # 2 — Exact keyword scan
    for key, entry in KB.items():
        for kw in entry["keywords"]:
            if kw in msg:
                return entry["answer"], entry["category"]

    # 3 — Partial / word-level match
    words = msg.split()
    for word in words:
        if len(word) < 3:          # skip very short words (is, of, a …)
            continue
        for key, entry in KB.items():
            for kw in entry["keywords"]:
                if word in kw or kw in word:
                    return entry["answer"], entry["category"]

    # 4 — Fallback
    return FALLBACK, "fallback"


# ── Schemas ────────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

    @validator("message")
    def message_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Message cannot be empty.")
        if len(v) > 1000:
            raise ValueError("Message too long (max 1000 characters).")
        return v.strip()


class ChatResponse(BaseModel):
    response: str
    session_id: str
    category: str
    timestamp: str


# ── Endpoint ───────────────────────────────────────────────────────────────────
@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        # Store last message in session context
        SESSION_CONTEXT[req.session_id] = {
            "last_message": req.message,
            "timestamp": datetime.utcnow().isoformat(),
        }

        # Log query
        logger.info(f"[{req.session_id}] User: {req.message!r}")

        # Find answer
        answer, category = find_answer(req.message, req.session_id)

        # Log response category
        logger.info(f"[{req.session_id}] → category={category!r}")

        return ChatResponse(
            response=answer,
            session_id=req.session_id,
            category=category,
            timestamp=datetime.utcnow().isoformat(),
        )

    except Exception as exc:
        logger.error(f"[{req.session_id}] Unexpected error: {exc}", exc_info=True)
        return ChatResponse(
            response="⚠️ Sorry, something went wrong on our end. Please try again.",
            session_id=req.session_id,
            category="error",
            timestamp=datetime.utcnow().isoformat(),
        )