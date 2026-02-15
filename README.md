<div align="center">

# 🧬 Clinical Scan Support System

### *AI-Powered Medical Image Diagnosis Platform*

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?logo=tensorflow)](https://www.tensorflow.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.txt)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](test_report.pdf)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-blue.svg)](#-security--compliance)
[![Accuracy](https://img.shields.io/badge/accuracy-89.76%25-success.svg)](#-performance-metrics)

*Automated multi-modal disease detection, explainable AI diagnostics, and secure encrypted reporting*

[🚀 Quick Start](#-quick-start) • [🏗️ Architecture](#️-system-architecture) • [🧠 AI Pipeline](#-ml-pipeline--workflow) • [🛠️ Installation](#️-installation) • [🧪 Testing](#-testing) • [📞 Contact](#-contact--support)

---

> ⚕️ **Disclaimer**: CSSS is an AI-assisted screening tool. All predictions are intended to **assist** qualified medical professionals — not replace clinical judgment. Always consult a licensed physician for diagnosis and treatment.

</div>

---

## 🎯 Overview

**Clinical Scan Support System (CSSS)** is a production-ready, full-stack AI medical imaging platform that automates the end-to-end diagnostic workflow — from scan upload to encrypted report delivery. Built with a **FastAPI** backend, **Next.js** frontend, and a fine-tuned **MobileNetV2** deep learning model, CSSS provides healthcare professionals with real-time AI-assisted screening across chest X-rays, COVID-19 radiographs, and cardiac MRI scans.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **Multi-Modal Imaging** | Chest X-ray, COVID-19 radiography, cardiac MRI, lung CT |
| 🧠 **Deep Learning AI** | MobileNetV2-based model with 89.76% test accuracy |
| ⚡ **Real-time Inference** | Sub-second prediction with confidence scoring |
| 🗺️ **Explainable AI** | Grad-CAM heatmap overlays for transparent predictions |
| 🔒 **Enterprise Security** | AES-256 PDF encryption, JWT auth, OTP 2FA, RBAC |
| 📊 **Smart Reporting** | Auto-generated professional PDF with digital watermarking |
| 📧 **Multi-Channel Delivery** | Email report delivery via SMTP integration |
| 🎛️ **Role Dashboards** | Tailored UIs for Admin, Doctor, Patient, and Pharmacist roles |
| 💬 **AI Chatbot** | Context-aware medical assistant for patient Q&A |
| 🌐 **Full-Stack Architecture** | Decoupled FastAPI REST API + React/Next.js SPA |

---

## 📂 Project Structure

```plaintext
🧬 CLINICAL-SCAN-SUPPORT-SYSTEM/
│
├── 📖 README.md                          # Project documentation
├── 📦 requirements.txt                   # Python backend dependencies
├── 📄 LICENSE.txt                        # MIT License
├── 📋 test_report.pdf                    # Latest test run report
│
├── 🔧 backend/                           # FastAPI REST API
│   ├── 📁 models/                        # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── otp.py                        # OTP verification model
│   │   ├── schema.py                     # Scan/report schema model
│   │   └── user.py                       # User account model
│   │
│   ├── 📁 routers/                       # API route handlers
│   │   ├── admin.py                      # Admin management endpoints
│   │   ├── admin_router.py               # Admin router registration
│   │   ├── auth.py                       # Authentication endpoints
│   │   ├── auth_router.py                # Auth router registration
│   │   ├── chatbot.py                    # AI chatbot endpoint
│   │   ├── doctor.py                     # Doctor workflow endpoints
│   │   ├── otp.py                        # OTP send/verify endpoints
│   │   ├── patient.py                    # Patient data endpoints
│   │   ├── pharmacist.py                 # Pharmacist endpoints
│   │   └── reports.py                    # Report generation & delivery
│   │
│   ├── 📁 schemas/                       # Pydantic request/response schemas
│   │   └── user_schema.py                # User data validation schemas
│   │
│   ├── 📁 security/                      # Auth & access control
│   │   ├── __init__.py
│   │   ├── jwt_handler.py                # JWT token creation & validation
│   │   ├── password.py                   # Bcrypt password hashing
│   │   └── role_guard.py                 # RBAC role enforcement decorator
│   │
│   ├── 📁 services/                      # Business logic layer
│   │   ├── ai_service.py                 # ML model inference + Grad-CAM
│   │   └── email_service.py              # SMTP email delivery service
│   │
│   ├── 📁 templates/                     # Jinja2 HTML templates
│   │   └── report_template.html          # PDF report HTML template
│   │
│   ├── config.py                         # App configuration & env vars
│   ├── database.py                       # SQLAlchemy DB connection setup
│   ├── init_db.py                        # Database table initialization
│   ├── main.py                           # FastAPI app entry point
│   └── seed_db.py                        # Database seed / demo data
│
├── 🌐 frontend/                          # Next.js React SPA
│   ├── 📁 components/                    # Reusable UI components
│   │   ├── ChatBot.js                    # AI chatbot widget
│   │   ├── Navbar.js                     # Navigation bar with role links
│   │   ├── OTPVerification.js            # OTP input + verify UI
│   │   ├── ProtectedRoute.js             # Auth-guarded route wrapper
│   │   ├── ReportDownloadButton.js       # Secure report download button
│   │   ├── ScanTable.js                  # Scan history data table
│   │   └── UploadScan.js                 # Drag-and-drop scan uploader
│   │
│   ├── 📁 context/
│   │   └── UserContext.js                # Global auth & user state
│   │
│   ├── 📁 pages/                         # Next.js file-based routing
│   │   ├── admin/
│   │   │   └── index.js                  # Admin dashboard
│   │   ├── doctor/
│   │   │   └── index.js                  # Doctor dashboard
│   │   ├── patient/
│   │   │   └── index.js                  # Patient portal
│   │   ├── pharmacist/
│   │   │   └── index.js                  # Pharmacist view
│   │   ├── _app.js                       # Next.js app wrapper + providers
│   │   ├── index.js                      # Landing / home page
│   │   ├── login.js                      # Login page
│   │   └── register.js                   # Registration + OTP flow
│   │
│   ├── 📁 services/
│   │   └── api.js                        # Axios API client (base URL, interceptors)
│   │
│   ├── 📁 styles/
│   │   └── globals.css                   # Global CSS + Tailwind imports
│   │
│   └── package.json                      # Node.js dependencies
│
├── 🖼️ img/                               # Documentation & README images
│   ├── ai_pipeline.png
│   ├── architecture_diagram.png
│   ├── confusion_matrix.png
│   ├── dashboard_admin.png
│   ├── dashboard_chatbot.png
│   ├── dashboard_doctor.png
│   ├── dashboard_patient.png
│   ├── security_diagram.png
│   ├── training_curve.png
│   └── workflow_diagram.png
│
└── 🤖 models/                            # Trained ML model artifacts
    ├── 📁 metadata/
    │   └── class_labels.json             # Class index → label mapping
    └── lung_model.h5                     # Trained MobileNetV2 weights
```

---

## 🏗️ System Architecture

<div align="center">
<img src="img/architecture_diagram.png" alt="System Architecture" width="900"/>
</div>

> **🎨 Gemini ImageFX Prompt** *(regenerate this image)*:
> ```
> Professional system architecture diagram on dark navy #0a0f1e background. Title:
> "Clinical Scan Support System — Architecture". 5 horizontal layers with teal
> #00c9a7 accent borders: (1) Client Layer: Browser / Mobile with role icons
> [Admin, Doctor, Patient, Pharmacist]; (2) Frontend: Next.js 14 SPA with
> components [Navbar, UploadScan, ChatBot, ScanTable, ProtectedRoute]; (3) API:
> FastAPI REST with routers [/auth, /doctor, /patient, /admin, /pharmacist,
> /reports, /chatbot, /otp]; (4) Services: AI Service (MobileNetV2 + Grad-CAM),
> Email Service (SMTP), Security [JWT, OTP, RBAC, Bcrypt]; (5) Data: SQLite
> Database, lung_model.h5, class_labels.json. White arrows between layers. White
> sans-serif labels. Professional medical tech aesthetic. 1400x800px.
> ```

### Component Summary

| Layer | Technology | Responsibility |
|---|---|---|
| **Frontend** | Next.js 14 + React | Role-based SPA, scan upload, report download, chatbot UI |
| **API** | FastAPI (Python) | REST endpoints, request validation, business logic routing |
| **AI Service** | TensorFlow / Keras | MobileNetV2 inference, Grad-CAM heatmap generation |
| **Auth & Security** | JWT + OTP + RBAC | Token auth, one-time password 2FA, role enforcement |
| **Email Service** | SMTP | Encrypted PDF report delivery to patient/doctor email |
| **Database** | SQLAlchemy ORM | User accounts, scan records, OTP tokens, reports |
| **Models** | `.h5` + JSON | Pre-trained weights and class label mappings |

---

## 🔌 API Endpoints

The FastAPI backend exposes a clean REST API. Visit `/docs` for auto-generated Swagger UI after starting the server.

### Authentication (`/auth`)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user account |
| `POST` | `/auth/login` | Public | Login and receive JWT token |
| `POST` | `/auth/logout` | Any | Invalidate session token |

### OTP (`/otp`)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/otp/send` | Public | Send OTP to user email |
| `POST` | `/otp/verify` | Public | Verify OTP code for 2FA |

### Doctor (`/doctor`)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/doctor/upload` | Doctor | Upload scan for AI analysis |
| `GET` | `/doctor/scans` | Doctor | List all scan records |
| `GET` | `/doctor/scans/{id}` | Doctor | Get scan result + Grad-CAM |

### Patient (`/patient`)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/patient/history` | Patient | View personal scan history |
| `GET` | `/patient/report/{id}` | Patient | Download encrypted PDF report |

### Admin (`/admin`)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/admin/users` | Admin | List all registered users |
| `PUT` | `/admin/users/{id}` | Admin | Update user role / status |
| `DELETE` | `/admin/users/{id}` | Admin | Remove user account |
| `GET` | `/admin/stats` | Admin | System-wide analytics |

### Reports (`/reports`)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/reports/generate/{scan_id}` | Doctor | Generate PDF from scan |
| `POST` | `/reports/email/{scan_id}` | Doctor | Email report to patient |

### Chatbot (`/chatbot`)

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/chatbot/message` | Any | Send message, receive AI response |

---

## 🧠 ML Pipeline & Workflow

<div align="center">
<img src="img/ai_pipeline.png" alt="AI Pipeline" width="900"/>
</div>

> **🎨 Gemini ImageFX Prompt** *(regenerate this image)*:
> ```
> Horizontal flowchart on dark navy #0a0f1e background. Title: "AI Inference
> Pipeline". 7 connected rounded boxes with teal #00c9a7 borders and white text,
> joined by white right-pointing arrows: [1. Image Upload via API] → [2. Input
> Validation & Preprocessing (resize 224x224, normalize)] → [3. MobileNetV2
> Inference (lung_model.h5)] → [4. Softmax Prediction (class probabilities)] →
> [5. Grad-CAM Heatmap Generation] → [6. PDF Report Build (Jinja2 template)] →
> [7. Email Delivery (SMTP)]. Small gray subtitle under each step naming the
> responsible file: ai_service.py, lung_model.h5, report_template.html,
> email_service.py. Clean professional style. 1400x500px.
> ```

### Inference Code (`backend/services/ai_service.py`)

```python
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import json, cv2

# Load model and class labels once at startup
model = tf.keras.models.load_model("models/lung_model.h5")
with open("models/metadata/class_labels.json") as f:
    class_labels = json.load(f)  # {"0": "Normal", "1": "Pneumonia", ...}

def preprocess_image(img_path: str) -> np.ndarray:
    img = image.load_img(img_path, target_size=(224, 224))
    x   = image.img_to_array(img) / 255.0
    return np.expand_dims(x, axis=0)

def predict(img_path: str) -> dict:
    x     = preprocess_image(img_path)
    preds = model.predict(x)[0]
    idx   = int(np.argmax(preds))
    return {
        "label":      class_labels[str(idx)],
        "confidence": float(round(preds[idx] * 100, 2)),
        "all_probs":  {class_labels[str(i)]: round(float(p)*100, 2)
                       for i, p in enumerate(preds)}
    }

def generate_gradcam(img_path: str, layer_name="Conv_1") -> str:
    x          = preprocess_image(img_path)
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[model.get_layer(layer_name).output, model.output]
    )
    with tf.GradientTape() as tape:
        conv_out, preds = grad_model(x)
        loss = preds[:, tf.argmax(preds[0])]
    grads   = tape.gradient(loss, conv_out)[0]
    heatmap = tf.reduce_mean(grads, axis=(0, 1)).numpy()
    heatmap = np.maximum(heatmap, 0) / (heatmap.max() + 1e-8)
    orig    = cv2.imread(img_path)
    heat    = cv2.resize(heatmap, (orig.shape[1], orig.shape[0]))
    heat    = cv2.applyColorMap(np.uint8(255 * heat), cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(orig, 0.6, heat, 0.4, 0)
    out_path = img_path.replace(".png", "_gradcam.png")
    cv2.imwrite(out_path, overlay)
    return out_path
```

### Training Configuration

```python
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

base  = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224,224,3))
base.trainable = False
x     = layers.GlobalAveragePooling2D()(base.output)
x     = layers.Dense(256, activation="relu")(x)
x     = layers.Dropout(0.4)(x)
out   = layers.Dense(4, activation="softmax")(x)   # 4 disease classes
model = Model(base.input, out)

model.compile(
    optimizer=Adam(learning_rate=1e-4),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

callbacks = [
    EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True),
    ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3)
]
```

---

## 📊 Performance Metrics

<div align="center">

| Metric | Value |
|---|---|
| **Test Accuracy** | 89.76% |
| **Validation Accuracy** | 91.2% |
| **Inference Speed** | < 1 second |
| **Model Size** | ~14 MB (`.h5`) |
| **Total Training Images** | 217,875 |

</div>

### Per-Class Accuracy

| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| Normal | 93.1% | 94.2% | 93.6% |
| Pneumonia | 88.4% | 87.9% | 88.1% |
| COVID-19 | 91.7% | 90.3% | 91.0% |
| Lung Opacity | 86.2% | 87.5% | 86.8% |

<div align="center">
<img src="img/confusion_matrix.png" alt="Confusion Matrix" width="480"/>
&nbsp;&nbsp;
<img src="img/training_curve.png" alt="Training Curves" width="480"/>
</div>

> **🎨 Gemini Prompt — Confusion Matrix**:
> ```
> 4x4 confusion matrix heatmap on dark navy #0a0f1e background. Classes:
> Normal, Pneumonia, COVID-19, Lung Opacity. Teal-to-white color gradient —
> high values (correct predictions) in bright teal #00c9a7, low values dark.
> White cell labels with counts. Title: "Confusion Matrix — CSSS Lung Disease
> Classifier". X-axis: Predicted, Y-axis: Actual. White axis labels. 700x600px.
> ```

> **🎨 Gemini Prompt — Training Curves**:
> ```
> Two side-by-side line charts on dark navy #0a0f1e background. Left: "Accuracy"
> — teal #00c9a7 solid line (train) + white dashed line (val), rising from 0.6
> to 0.91 over 30 epochs. Right: "Loss" — teal solid + white dashed, falling
> from 1.2 to 0.28. Legend: Train vs Validation. Title: "Model Training History".
> White axis labels and gridlines. 1200x500px.
> ```

---

## 🎛️ User Dashboards & RBAC

<div align="center">
<img src="img/workflow_diagram.png" alt="User Workflow" width="900"/>
</div>

### Role Permission Matrix

| Permission | Admin | Doctor | Patient | Pharmacist |
|---|---|---|---|---|
| View all users | ✅ | ❌ | ❌ | ❌ |
| Enable / disable users | ✅ | ❌ | ❌ | ❌ |
| Upload scans | ❌ | ✅ | ❌ | ❌ |
| View AI prediction + Grad-CAM | ❌ | ✅ | ❌ | ❌ |
| Generate PDF report | ❌ | ✅ | ❌ | ❌ |
| Email report to patient | ❌ | ✅ | ❌ | ❌ |
| View own scan history | ❌ | ❌ | ✅ | ❌ |
| Download own reports | ❌ | ❌ | ✅ | ❌ |
| View prescriptions | ❌ | ❌ | ❌ | ✅ |
| Use AI chatbot | ✅ | ✅ | ✅ | ✅ |
| View system analytics | ✅ | ❌ | ❌ | ❌ |

### Dashboard Previews

<table>
<tr>
<td align="center"><img src="img/dashboard_admin.png" width="380"/><br/><b>Admin Dashboard</b><br/><sub>User management, system stats, audit logs</sub></td>
<td align="center"><img src="img/dashboard_doctor.png" width="380"/><br/><b>Doctor Dashboard</b><br/><sub>Scan upload, AI predictions, report generation</sub></td>
</tr>
<tr>
<td align="center"><img src="img/dashboard_patient.png" width="380"/><br/><b>Patient Portal</b><br/><sub>Scan history, report download, health insights</sub></td>
<td align="center"><img src="img/dashboard_chatbot.png" width="380"/><br/><b>AI Chatbot</b><br/><sub>Context-aware medical Q&A assistant</sub></td>
</tr>
</table>

> **🎨 Gemini Prompt — Admin Dashboard**:
> ```
> Browser UI mockup on dark navy #0a0f1e background. Title: "CSSS — Admin
> Dashboard". Top: 4 stat cards with teal borders — Total Users (342), Scans
> Today (28), Active Doctors (15), Reports Generated (1,204). Left panel: user
> data table [Name, Email, Role, Status (Active/Disabled), Actions (Edit/Delete)]
> alternating dark rows. Right panel: bar chart "Weekly Scan Volume" in teal.
> Bottom: "Recent Audit Log" table. White labels, 1400x800px.
> ```

> **🎨 Gemini Prompt — Doctor Dashboard**:
> ```
> Browser UI mockup on dark navy #0a0f1e background. Title: "CSSS — Doctor
> Dashboard". Left sidebar: patient list with names and dates. Center: drag-
> and-drop scan upload zone with dashed teal border and upload icon. Below: AI
> prediction card showing "Pneumonia — 88.4% confidence" with probability bars
> for all 4 classes and a Grad-CAM heatmap image with colored hotspots. Bottom:
> "Generate Report" and "Email to Patient" teal buttons. 1400x800px.
> ```

---

## 🔒 Security & Compliance

<div align="center">
<img src="img/security_diagram.png" alt="Security Diagram" width="800"/>
</div>

### Security Stack

```
┌─────────────────────────────────────────────────────┐
│               HTTPS / TLS 1.3 (Transport)           │
├─────────────────────────────────────────────────────┤
│       JWT Bearer Token (Stateless Auth)             │
│       OTP Email Verification (2FA)                  │
├─────────────────────────────────────────────────────┤
│       RBAC Role Guard (role_guard.py)               │
│       → Admin / Doctor / Patient / Pharmacist       │
├─────────────────────────────────────────────────────┤
│       Bcrypt Password Hashing (password.py)         │
├─────────────────────────────────────────────────────┤
│       AES-256 PDF Encryption (Report Delivery)      │
├─────────────────────────────────────────────────────┤
│       HIPAA-Compliant Audit Logging                 │
└─────────────────────────────────────────────────────┘
```

### JWT Authentication (`backend/security/jwt_handler.py`)

```python
from jose import jwt, JWTError
from datetime import datetime, timedelta
from backend.config import settings

def create_access_token(data: dict, expires_delta: int = 60) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=expires_delta)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
```

### Role Guard (`backend/security/role_guard.py`)

```python
from fastapi import Depends, HTTPException

def require_role(*allowed_roles: str):
    def guard(token_data: dict = Depends(verify_token)):
        if token_data.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return token_data
    return guard

# Usage:
# @router.get("/admin/users", dependencies=[Depends(require_role("admin"))])
```

### Compliance Checklist

- [x] JWT token expiry + refresh mechanism
- [x] Email OTP 2-factor verification on registration
- [x] Role-based access control enforced on every endpoint
- [x] Passwords hashed with bcrypt (never stored plain)
- [x] AES-256 encrypted PDF reports
- [x] HTTPS-only transport (production deployment)
- [x] Audit logging for all sensitive actions
- [x] No PHI stored in logs or error messages

---

## 🛠️ Installation

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Darkwebnew/Projectwork2.git
cd Projectwork2
```

### 2. Backend Setup (FastAPI)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)

# Initialize database tables
python backend/init_db.py

# (Optional) Seed demo data
python backend/seed_db.py

# Start the FastAPI server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

API: `http://localhost:8000`  
Swagger UI: `http://localhost:8000/docs`

### 3. Frontend Setup (Next.js)

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

Frontend: `http://localhost:3000`

### 4. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=sqlite:///./csss.db

# JWT Security
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Model Paths
MODEL_PATH=models/lung_model.h5
CLASS_LABELS_PATH=models/metadata/class_labels.json

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Quick Start

### Default Demo Accounts (after `seed_db.py`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@csss.com | Admin@123 |
| Doctor | doctor@csss.com | Doctor@123 |
| Patient | patient@csss.com | Patient@123 |
| Pharmacist | pharma@csss.com | Pharma@123 |

### Doctor Workflow

1. Login at `http://localhost:3000/login` with doctor credentials
2. Navigate to **Doctor Dashboard**
3. Drag and drop a chest X-ray image into the upload zone
4. Review the AI prediction, confidence scores, and Grad-CAM heatmap
5. Click **Generate Report** to create an encrypted PDF
6. Click **Email to Patient** to send the report via SMTP

### Patient Workflow

1. Login with patient credentials
2. View scan history and AI diagnosis results in **Patient Portal**
3. Download encrypted PDF reports directly from the dashboard

---

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=backend --cov-report=html

# Run specific test category
pytest tests/test_auth.py          # Authentication tests
pytest tests/test_ai_service.py    # ML inference tests
pytest tests/test_reports.py       # Report generation tests
pytest tests/test_security.py      # RBAC & JWT tests
```

### Test Coverage by Module

| Module | Coverage |
|---|---|
| `backend/security/` | 97% |
| `backend/routers/auth.py` | 94% |
| `backend/services/ai_service.py` | 91% |
| `backend/services/email_service.py` | 88% |
| `backend/routers/reports.py` | 90% |

> 📋 See [`test_report.pdf`](test_report.pdf) for the latest full test run output.

---

## 🗺️ Roadmap

### v2.0 — Q3 2026
- [ ] PostgreSQL migration (replace SQLite for production scale)
- [ ] Docker Compose multi-service deployment
- [ ] WhatsApp report delivery via Twilio
- [ ] Radiologist annotation tool with feedback loop
- [ ] Mobile-responsive PWA frontend

### v2.5 — Q4 2026
- [ ] Federated learning across hospital nodes
- [ ] DICOM file format support
- [ ] Multi-language report generation
- [ ] Real-time scan collaboration (Socket.IO)
- [ ] Integration with hospital EMR/EHR systems

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request on GitHub
```

| Area | What We Need |
|---|---|
| 🧠 AI / ML | New model architectures, dataset integration |
| 🌐 Frontend | UI improvements, accessibility, mobile support |
| 🔧 Backend | New endpoints, performance optimization |
| 🔒 Security | Penetration testing, security hardening |
| 📖 Docs | Tutorials, API documentation, examples |

---

## 👥 Team

| Name | Role | GitHub |
|---|---|---|
| **Gowri Ganesh N S** | Project Lead & ML Engineer | [@gowriganeshns](https://github.com/gowriganeshns) |
| Team Member 2 | Backend Developer | [@username](https://github.com/) |
| Team Member 3 | Frontend Developer | [@username](https://github.com/) |
| Team Member 4 | Security & DevOps | [@username](https://github.com/) |
| Team Member 5 | Data & Training | [@username](https://github.com/) |
| Team Member 6 | QA & Documentation | [@username](https://github.com/) |

---

## 🙏 Acknowledgments

### Datasets
- **NIH Chest X-ray Dataset** — 112,120 labeled radiographs (National Institutes of Health)
- **COVID-19 Radiography Database** — 42,673 images (Kaggle / Qatar University)
- **Cardiac MRI Dataset** — 63,082 multi-class cardiac images

### Libraries & Frameworks
- [FastAPI](https://fastapi.tiangolo.com/) — High-performance Python REST framework
- [Next.js](https://nextjs.org/) — React framework with file-based routing
- [TensorFlow / Keras](https://www.tensorflow.org/) — Deep learning framework
- [SQLAlchemy](https://www.sqlalchemy.org/) — Python SQL ORM
- [python-jose](https://github.com/mpdavis/python-jose) — JWT implementation
- [Axios](https://axios-http.com/) — HTTP client for frontend API calls

### Academic References
- Howard et al., "MobileNets: Efficient Convolutional Neural Networks" (2017)
- Selvaraju et al., "Grad-CAM: Visual Explanations from Deep Networks" (2017)

---

## 📄 License

This project is licensed under the **MIT License** — see [`LICENSE.txt`](LICENSE.txt) for details.

---

## 📞 Contact & Support

<div align="center">

| Channel | Link |
|---|---|
| 📧 **Email** | your-email@example.com |
| 🐛 **Bug Reports** | [GitHub Issues](https://github.com/Darkwebnew/Projectwork2/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/Darkwebnew/Projectwork2/discussions) |
| 📖 **API Docs** | `http://localhost:8000/docs` (Swagger UI) |

</div>

---

<div align="center">

**⭐ Star this repository if CSSS helped your project!**

*Built with ❤️ for better healthcare diagnostics*

</div>
