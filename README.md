# 🧬 CLINICAL-SCAN-SUPPORT-SYSTEM (CSSS)

![Python Version](https://img.shields.io/badge/python-3.10-blue?logo=python)
![Streamlit](https://img.shields.io/badge/streamlit-1.25-orange?logo=streamlit)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/CSSS/ci.yml?branch=main)
![Issues](https://img.shields.io/github/issues/yourusername/CSSS)
![Forks](https://img.shields.io/github/forks/yourusername/CSSS)

---

## 🚀 Project Overview

**CLINICAL-SCAN-SUPPORT-SYSTEM (CSSS)** is an AI-powered medical image diagnosis platform designed to automate the analysis of chest X-rays, COVID-19 radiography, and cardiac MRI scans. It enables hospitals and clinics to:

- Provide automated disease detection (Lung, COVID-19, Heart conditions) using deep learning models.
- Generate **secure PDF reports** for patient diagnostics.
- Deliver reports via **Email** and **WhatsApp**.
- Offer **role-based dashboards** for Admin, Doctor, and Patient.
- Track activity logs, audit user actions, and enforce 2FA security.
- Deploy locally, on Docker, or via Streamlit Cloud with ease.

CSSS integrates AI, cybersecurity, and cloud-ready deployment to create a professional, end-to-end medical diagnostic support system.

---

## 📝 Key Highlights

- AI Diagnosis Engine using **MobileNetV2** for classification.
- Dataset preprocessing and automated splitting.
- Streamlit-based UI for multiple user roles.
- PDF report generation with encryption.
- Email and WhatsApp notifications for patients.
- Audit logs, analytics, and observability tools.
- Dockerized and Streamlit Cloud deployment-ready.

---

## 📚 Table of Contents

<details>
<summary>Click to expand</summary>

- [🚀 Project Overview](#-project-overview)
- [📝 Key Highlights](#-key-highlights)
- [📋 Features](#-features)
- [🗂️ Project Structure](#️-project-structure)
- [🤖 ML Pipeline & Workflow](#-ml-pipeline--workflow)
- [🖥️ Streamlit UI & Role-Based Access](#️-streamlit-ui--role-based-access)
- [🔐 Security & Observability](#-security--observability)
- [⚡ Setup & Installation](#-setup--installation)
- [🐳 Docker Deployment](#-docker-deployment)
- [☁️ Streamlit Cloud Deployment](#️-streamlit-cloud-deployment)
- [🧪 Testing & Validation](#-testing--validation)
- [🤝 Contribution](#-contribution)
- [📜 License](#-license)

</details>

---

## 📋 Features

<details>
<summary>Click to expand</summary>

### Core Features

- Multi-modal AI diagnosis for **chest X-rays**, **COVID-19 scans**, and **cardiac MRIs**.
- Dataset preprocessing, normalization, and automated train/validation/test splitting.
- **Role-based dashboards** for Admin, Doctor, and Patient.
- PDF report generation with **encryption**.
- Notifications via **Email** and **WhatsApp**.

### AI & ML Features

- Disease prediction using **MobileNetV2** neural network.
- Explainable AI heatmaps & confidence analysis.
- Automatic dataset statistics and labeling.
- Model evaluation metrics: **accuracy, precision, recall, F1-score**.

### Security & Compliance

- User authentication with **2FA**.
- Role-based access control.
- Audit logs for all system activities.
- Encrypted PDF reports using AES encryption.

### Deployment & DevOps

- Local Python setup with requirements.txt.
- Dockerized environment for reproducible deployment.
- Streamlit Cloud ready for instant web deployment.
- Continuous Integration with GitHub Actions.

</details>

---

## 🗂️ Project Structure

<details>
<summary>Click to expand</summary>

```plaintext
🧬 CLINICAL-SCAN-SUPPORT-SYSTEM/
│
├── 🔑 .env                               # Environment secrets (email, encryption keys, API tokens)
├── 🖥️ app.py                             # Main Streamlit application entry point
├── 📖 README.md                          # Complete project documentation
├── 📦 requirements.txt                   # Python dependency list
├── 📦 requirements_streamlit.txt         # Streamlit-specific packages
├── 🧪 validate_project.py                # System health & integrity validation script
├── 🗂️ split_lung_dataset.py              # Dataset splitting automation
├── 🏋️ train_lung_model.py                # Model training pipeline
├── 📜 CHANGELOG.md                       # Version history and release notes
├── ⚖️ LICENSE                            # Open-source license file
│
├── 🗂️ .github/                           # GitHub automation
│   └── 🤖 workflows/
│       └── ✅ ci.yml                     # Continuous Integration (automated tests)
│
├── 📚 docs/                              # Technical documentation
│   ├── 🧭 architecture.md               # System architecture design
│   ├── 🔐 security.md                    # Security design & compliance
│   ├── 🤖 ai_pipeline.md                 # ML training & inference pipeline
│   ├── 📊 datasets.md                    # Dataset sources and statistics
│   └── 🚀 deployment.md                  # Deployment guide
│
├── 📊 reports/                           # Generated medical reports
│   ├── 🔒 encrypted/                     # Final encrypted PDF reports
│   └── 🕒 temp/                          # Temporary PDF staging files
│
├── 📤 uploads/                           # User uploaded medical images
│   ├── 🧑 patient_scans/                 # Raw patient uploads
│   ├── 🧪 preprocessed/                  # Cleaned & resized images
│   └── 🗃️ rejected/                      # Invalid / corrupted scans
│
├── 🗄️ database/                         # Structured databases
│   ├── 💾 users.db                       # Login credentials & roles
│   ├── 🫁 patients.db                    # Patient profiles & approvals
│   ├── 📄 reports.db                     # Report metadata
│   └── 🧾 audit_logs.db                  # Security & activity logs
│
├── 📂 Dataset/                           # Training datasets
│   ├── 🩻 chest_xray_nih/                # NIH Chest X-ray Dataset
│   │   ├── images_001/
│   │   ├── images_002/
│   │   └── …                             # Total ≈ 112,120 images
│   │
│   ├── 🦠 covid_xray/                    # COVID-19 Radiography Dataset
│   │   ├── COVID/
│   │   ├── Lung_Opacity/
│   │   └── …                             # Total ≈ 42,330 images
│   │
│   ├── 🫀 heart_mri/                     # Cardiac MRI Dataset
│   │   ├── Normal/
│   │   └── Sick/                         # Total ≈ 63,425 images
│   │
│   ├── 🫁 lung/                          # Processed Lung Dataset (Split)
│   │   ├── 🏋️ train/                     # Training images
│   │   ├── 📊 val/                        # Validation images
│   │   ├── 🧪 test/                       # Testing images
│   │   └── 📄 dataset_split_log_20260124.txt
│   │
│   └── 📑 dataset_metadata.json          # Auto-generated dataset stats & labels
│
├── 🧩 src/                               # Core source code
│   │
│   ├── 🔐 security/                      # Authentication & data protection
│   │   ├── 🛡️ auth.py                     # Login + session handling
│   │   ├── 🔑 two_factor.py               # Admin 2FA validation
│   │   ├── 🔏 crypto.py                   # PDF encryption engine
│   │   ├── 🚦 access_control.py           # Role permissions
│   │   └── 📜 logger.py                   # Secure audit logging
│   │
│   ├── 🤖 ai/                            # Artificial Intelligence layer
│   │   ├── 🧠 predictor.py               # Disease prediction engine
│   │   ├── 🧹 preprocessor.py            # Image normalization & resizing
│   │   ├── 💬 chatbot.py                 # Medical AI assistant
│   │   ├── 🔍 explainability.py          # Heatmaps / confidence analysis
│   │   └── 📦 artifacts/                 # ML assets
│   │       ├── 🧬 models/               # Trained neural networks
│   │       ├── 📈 metrics/              # Accuracy, loss, evaluation
│   │       ├── 🏷️ labels/               # Class mappings
│   │       └── 🖼️ plots/                # Training graphs & confusion matrix
│   │
│   ├── 🗄️ database/                      # Database abstraction layer
│   │   ├── 👤 user_db.py                 # User CRUD operations
│   │   ├── 🧑‍⚕️ patient_db.py            # Patient records
│   │   ├── 📑 report_db.py               # Reports tracking
│   │   └── 🩻 scan_db.py                 # Scan metadata
│   │
│   ├── 📄 services/                       # Business services
│   │   ├── 🧾 pdf_service.py             # Professional PDF generator
│   │   ├── 📧 mail_service.py            # Email automation
│   │   ├── 📱 whatsapp_service.py        # WhatsApp delivery
│   │   ├── 🔔 notification_manager.py   # Unified messaging
│   │   └── 🗃️ storage_service.py        # File management
│   │
│   ├── 🎨 ui/                             # User interface modules
│   │   ├── 👨‍💼 admin_ui.py              # Admin dashboard
│   │   ├── 👨‍⚕️ doctor_ui.py             # Doctor dashboard
│   │   ├── 🧑 patient_ui.py              # Patient dashboard
│   │   ├── 💬 chatbot_ui.py             # Chatbot panel
│   │   └── 🔐 auth_ui.py                # Login & signup screens
│   │
│   ├── 🛠️ utils/                         # Utility helpers
│   │   ├── 🌿 env_loader.py             # Load environment variables
│   │   ├── 📂 file_utils.py             # File validation
│   │   ├── 🧪 validators.py             # Data validation
│   │   ├── ⏱️ time_utils.py             # Timestamp utilities
│   │   └── 📊 analytics.py              # Usage metrics
│   │
│   └── 🧪 tests/                         # Automated tests
│       ├── 🔬 test_auth.py
│       ├── 🧪 test_ai.py
│       ├── 📄 test_pdf.py
│       └── 📡 test_notifications.py
│
├── 🎨 assets/                             # Visual assets
│   ├── 🏥 logo.png
│   ├── 📄 report_template.html
│   ├── 🎨 styles.css
│   ├── 🧭 architecture_diagram.png
│   ├── 🧠 ai_pipeline.png
│   └── 🖥️ dashboard_mockups.png
│
└── 🚀 deployment/                        # Deployment configuration
    ├── 🐳 Dockerfile
    ├── ☁️ streamlit_cloud.yaml
    ├── 🔐 nginx.conf
    └── 📜 deploy_guide.md
```

</details>

---

## 🤖 ML Pipeline & Workflow

The Clinical Scan Support System (CSSS) integrates a full AI-driven medical imaging pipeline, supporting lung, chest X-ray, cardiac MRI, and COVID-19 datasets. This section explains the flow from dataset preprocessing to report generation and delivery.

### 1️⃣ Dataset Preparation

- **Scripts:** `split_lung_dataset.py` & preprocessing modules
- **Steps:**
  1. Load raw images from `Dataset/`.
  2. Validate image integrity & format.
  3. Resize & normalize images via `preprocessor.py`.
  4. Split datasets into **train**, **validation**, and **test** sets.
  5. Generate `dataset_metadata.json` for class statistics.

**Dataset Statistics (Examples):**
- NIH Chest X-ray: 112,120 images
- COVID-19 Radiography: 42,330 images
- Cardiac MRI: 63,425 images
- Processed lung dataset: train/val/test splits

**Example CLI command to split dataset:**

```bash
python split_lung_dataset.py --dataset Dataset/lung --output Dataset/lung_processed --train_ratio 0.7 --val_ratio 0.2 --test_ratio 0.1
```

---

### 2️⃣ Model Training

The CSSS uses deep learning models (CNNs) for medical image classification and diagnosis. The training pipeline is fully automated with logging and evaluation metrics.

- **Script:** `train_lung_model.py`
- **Supported Models:** MobileNetV2 (default), ResNet50, custom CNNs
- **Steps:**
  1. Load preprocessed images from `Dataset/lung/train` and `Dataset/lung/val`.
  2. Apply data augmentation (rotation, zoom, flips) for better generalization.
  3. Define CNN architecture and compile with appropriate loss function (categorical_crossentropy) and optimizer (Adam).
  4. Train the model with early stopping and learning rate scheduling.
  5. Save trained models in `src/ai/artifacts/models/`.
  6. Generate evaluation metrics: accuracy, loss curves, confusion matrices, classification reports.

**Example CLI command to train the model:**

```bash
python train_lung_model.py --model MobileNetV2 --epochs 50 --batch_size 32 --dataset Dataset/lung_processed
```

**Evaluation & Artifacts:**
- Metrics stored in `src/ai/artifacts/metrics/`
- Class label mappings in `src/ai/artifacts/labels/`
- Training plots (loss & accuracy curves) in `src/ai/artifacts/plots/`

---

### 3️⃣ Prediction & Inference Workflow

CSSS provides real-time predictions for uploaded medical images using the trained deep learning models. This module is fully integrated with the Streamlit UI and API endpoints.

- **Script:** `src/ai/predictor.py`
- **Input:** Preprocessed images from `uploads/preprocessed/`
- **Output:** Disease predictions, confidence scores, and heatmaps
- **Steps:**
  1. Load the trained model from `src/ai/artifacts/models/`.
  2. Preprocess the uploaded image (resize, normalize, convert to tensor).
  3. Run inference and generate class probabilities.
  4. Generate heatmaps using Grad-CAM for explainability (`src/ai/explainability.py`).
  5. Return structured prediction results to the UI or API.

**Example CLI usage for testing a single image:**

```bash
python src/ai/predictor.py --image uploads/preprocessed/sample_scan.png --model MobileNetV2
```

**Example API response:**

```json
{
  "patient_id": "P12345",
  "prediction": "Pneumonia",
  "confidence": 0.956,
  "heatmap": "uploads/preprocessed/sample_scan_heatmap.png"
}
```

**Integration with Streamlit UI:**
- Doctors upload images via `doctor_ui.py`.
- Predictions are displayed instantly along with heatmaps and confidence levels.
- Patients receive reports in PDF format automatically generated by `pdf_service.py`.

---

### 4️⃣ PDF Report Generation & Delivery Workflow

CSSS automates the generation and secure delivery of medical reports in PDF format.

- **Script:** `src/services/pdf_service.py`
- **Input:** Prediction results, patient info, doctor notes
- **Output:** Encrypted PDF stored in `reports/encrypted/` and optionally sent via email/WhatsApp

**Workflow:**
1. Collect prediction results and patient metadata.
2. Populate the professional report template (`assets/report_template.html`).
3. Convert HTML template to PDF using FPDF.
4. Encrypt PDF with AES-256 using `crypto.py`.
5. Save to `reports/encrypted/`.
6. Optional delivery:
   - **Email:** via `mail_service.py`
   - **WhatsApp:** via `whatsapp_service.py`
7. Audit logging in `audit_logs.db` for every generated report.

**Example CLI usage:**

```bash
python src/services/pdf_service.py --patient_id P12345 --report_type LungScan
```

**Example API response after PDF generation:**

```json
{
  "patient_id": "P12345",
  "report_file": "reports/encrypted/P12345_20260130.pdf",
  "status": "Delivered",
  "email_sent": true,
  "whatsapp_sent": false
}
```

**Security Notes:**
- PDFs are encrypted using `PDF_ENCRYPTION_KEY` from `.env`.
- Only authorized users with role-based access can view or download reports.
- All delivery actions are logged with timestamps for observability.

---

### 5️⃣ Email & WhatsApp Delivery

**Modules:** `mail_service.py`, `whatsapp_service.py`, `notification_manager.py`

**Email Delivery:**
- Service: `mail_service.py`
- Sender: Configured via `.env` (`EMAIL_SENDER`)
- Recipient: Patient or doctor
- Attachments: Encrypted PDF
- Security: SMTP with app-specific credentials

**Example:**

```python
from services.mail_service import send_email

send_email(
    recipient="patient@example.com",
    subject="Your Scan Report",
    body="Dear patient, your scan report is attached.",
    attachment="reports/encrypted/P1234_report.pdf"
)
```

**WhatsApp Delivery:**
- Service: `whatsapp_service.py`
- Integration: Twilio / WhatsApp API
- Use: Instant report notifications

**Example:**

```python
from services.whatsapp_service import send_whatsapp

send_whatsapp(
    phone_number="+91XXXXXXXXXX",
    message="Your encrypted scan report is ready. Check your email for details."
)
```

**Workflow Summary:**
1. Patient scan uploaded → validated → preprocessed
2. Prediction generated → heatmaps created
3. PDF report generated → encrypted
4. Delivered via email & WhatsApp
5. All actions logged in `audit_logs.db`

**Notes:**
- Supports bulk report generation
- End-to-end encryption ensures HIPAA compliance
- Configurable notifications for doctors, admins, and patients

---

### 6️⃣ Observability & Logging

- **Logging:** `logger.py` tracks authentication, file uploads, and report delivery.
- **Analytics:** `analytics.py` records system usage, training performance, and prediction statistics.
- **Security:** Audit logs prevent unauthorized access.

---

## 🖥️ Streamlit UI & Role-Based Access

CSSS provides a modern, interactive Streamlit interface with role-based access control for Doctors, Patients, and Admins.

**Main Entry:** `app.py`  
**UI Modules:** `src/ui/`

### Roles & Dashboards

| Role    | Accessible Sections                               |
|---------|--------------------------------------------------|
| Admin   | User management, Audit logs, System settings     |
| Doctor  | Upload scans, View patient reports, Chatbot      |
| Patient | Upload scans, View own reports, Chatbot          |

### Features

- **Authentication:** Login & 2FA via `auth_ui.py` & `two_factor.py`
- **Dynamic Navigation:** Only show menus for the logged-in role
- **Interactive Uploads:** Drag-and-drop scan upload with validation
- **Chatbot Integration:** AI medical assistant for patient queries
- **Report Viewer:** Embedded PDF viewer for encrypted reports
- **Notifications:** Real-time email/WhatsApp alerts when reports are ready

### CLI Launch

```bash
streamlit run app.py
```

### API Integration Example

```python
import requests

url = "http://localhost:8501/api/upload_scan"
files = {'scan': open('uploads/patient_scans/scan001.jpg', 'rb')}
data = {'patient_id': 'P12345', 'doctor_id': 'D6789'}

response = requests.post(url, files=files, data=data)
print(response.json())
```

### Security Considerations

- Role validation enforced in `access_control.py`
- All sensitive actions logged in `audit_logs.db`
- PDFs and session tokens encrypted

---

### Admin Dashboard (`admin_ui.py`)

**Features:**
- User management (add/edit/delete)
- Role assignment & 2FA management
- View system logs and audit trails
- Monitor AI training metrics and dataset stats

```python
import streamlit as st
from ui.admin_ui import show_admin_dashboard

st.title("Clinical Scan Support System - Admin Panel")
show_admin_dashboard()
```

---

### Doctor Dashboard (`doctor_ui.py`)

**Features:**
- Upload and review patient scans
- View AI predictions with heatmaps
- Generate, encrypt, and send PDF reports
- Track patient history and notifications

```python
from ui.doctor_ui import show_doctor_dashboard

show_doctor_dashboard(user_id="D5678")
```

---

### Patient Dashboard (`patient_ui.py`)

**Features:**
- View personal scan reports
- Receive notifications via email and WhatsApp
- Download encrypted PDF reports
- Access AI explanations in simple format

```python
from ui.patient_ui import show_patient_dashboard

show_patient_dashboard(patient_id="P1234")
```

---

### Chatbot Panel (`chatbot_ui.py`)

- AI assistant for answering patient queries
- Provides guidance on scans, results, and general healthcare advice

```python
from ui.chatbot_ui import show_chatbot_panel

show_chatbot_panel()
```

---

### Authentication Screens (`auth_ui.py`)

- Login, signup, and 2FA screens
- Role-based redirection after login
- Secure session handling

```python
from ui.auth_ui import login_screen

login_screen()
```

---

### Access Control

Defined in `access_control.py`

**Permissions for CRUD operations based on role:**
- **Admin:** Full access
- **Doctor:** Patient scan & report access
- **Patient:** Personal scan & report access only

All actions are logged in `audit_logs.db`

**Notes:**
- Streamlit themes and CSS applied from `assets/styles.css`
- Supports multi-user concurrent access
- Responsive UI design for desktop and tablet devices

---

## 🔐 Security & Observability

CSSS is designed with end-to-end security and monitoring in mind, covering authentication, data protection, and system observability.

### Authentication & Authorization

- Implemented in `security/auth.py` and `security/access_control.py`
- **Login Flow:**
  - Username/password validation
  - Optional 2FA for Admins (`security/two_factor.py`)
  - Session tokens stored securely
- **Role-Based Access:**
  - Admin → Full access
  - Doctor → Patient scan & report access
  - Patient → Personal scans only
- All access attempts are logged in `audit_logs.db`

### Data Encryption

- PDF reports encrypted using `security/crypto.py`  
- Environment-based encryption key (`.env` → `PDF_ENCRYPTION_KEY`)  
- Ensures compliance with HIPAA-like standards for patient data

### Secure File Handling

- Uploaded scans validated in `utils/file_utils.py`  
- Rejected files moved to `uploads/rejected/`  
- Preprocessing applied before model inference to prevent malicious content

### Audit & Logging

- All critical actions logged via `security/logger.py`  
- Logs include:
  - User ID, action, timestamp
  - Access attempts and failures
  - File uploads & downloads
- Stored in `database/audit_logs.db` for auditing and compliance

### Observability & Monitoring

- Usage metrics tracked via `utils/analytics.py`  
- Monitored metrics include:
  - Number of scans processed
  - AI model accuracy per batch
  - System uptime & errors
- Optional integration with external logging or monitoring tools (ELK, Prometheus)

### Security Best Practices

- `.env` file used for sensitive credentials  
- No hard-coded passwords or keys in source code  
- Docker containerization ensures isolated execution  
- Streamlit sessions securely expire after inactivity

---

## ⚡ Setup & Installation

### Local Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/CLINICAL-SCAN-SUPPORT-SYSTEM.git
cd CLINICAL-SCAN-SUPPORT-SYSTEM
```

2. **Create a virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
pip install -r requirements_streamlit.txt
```

4. **Configure `.env` file with credentials:**

```env
EMAIL_SENDER=youremail@example.com
CUSTOMER_EMAIL=patient@example.com
ADMIN_PHONE=+918754748489
PDF_ENCRYPTION_KEY=YourSecretKey123
APP_SECRET_KEY=clinical_ai_2026
```

5. **Run the Streamlit app:**

```bash
streamlit run app.py
```

6. **Access the dashboard:**

```
http://localhost:8501
```

---

## 🐳 Docker Deployment

### Build the Docker image:

```bash
docker build -t csss-app .
```

### Run the Docker container:

```bash
docker run -d -p 8501:8501 --name csss_container csss-app
```

### Access the app:

```
http://localhost:8501
```

### Stop & remove the container:

```bash
docker stop csss_container
docker rm csss_container
```

---

## ☁️ Streamlit Cloud Deployment

1. Push the repository to GitHub.
2. Connect the GitHub repo in [Streamlit Cloud](https://streamlit.io/cloud).
3. Set environment variables in the app settings.
4. Deploy; Streamlit Cloud handles server hosting automatically.

---

## 🧪 Testing & Validation

### Run validation script:

```bash
python validate_project.py
```

### Run automated tests:

```bash
python -m pytest src/tests/
```

### Test modules:
- `test_auth.py` - Authentication & 2FA
- `test_ai.py` - AI predictions & model accuracy
- `test_pdf.py` - PDF generation & encryption
- `test_notifications.py` - Email & WhatsApp delivery

---

## 🤝 Contribution

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions or support, please contact:
- **Email:** youremail@example.com
- **GitHub Issues:** [CSSS Issues](https://github.com/yourusername/CSSS/issues)

---

**Made with ❤️ for better healthcare through AI**
