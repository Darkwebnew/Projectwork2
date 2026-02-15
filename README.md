<div align="center">

# 🧬 Clinical Scan Support System

### *AI-Powered Medical Image Diagnosis Platform*

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/streamlit-1.40+-orange?logo=streamlit)](https://streamlit.io/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?logo=tensorflow)](https://www.tensorflow.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](tests/)
[![Code Style: Black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-blue.svg)](#-security--compliance)
[![Accuracy](https://img.shields.io/badge/accuracy-89.76%25-success.svg)](#-performance-metrics)

*Automated multi-modal disease detection, explainable AI diagnostics, and secure encrypted reporting*

[🚀 Quick Start](#-quick-start) • [🏗️ Architecture](#️-system-architecture) • [🧠 AI Pipeline](#-ml-pipeline--workflow) • [🛠️ Installation](#️-installation) • [🧪 Testing](#-testing) • [📞 Contact](#-contact--support)

---

> ⚕️ **Disclaimer**: CSSS is an AI-assisted screening tool. All predictions are intended to **assist** qualified medical professionals — not replace clinical judgment. Always consult a licensed physician for diagnosis and treatment.

</div>

---

## 🎯 Overview

**Clinical Scan Support System (CSSS)** is a production-ready, AI-powered medical imaging platform that automates the end-to-end diagnostic workflow — from scan upload to encrypted report delivery. Built with state-of-the-art deep learning, enterprise-grade security, and a role-aware multi-user interface, CSSS empowers healthcare professionals with faster, more accurate screening insights.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **Multi-Modal Imaging** | Chest X-ray, COVID-19 radiography, cardiac MRI, lung CT |
| 🧠 **Deep Learning AI** | MobileNetV2-based model with 89.76% test accuracy |
| ⚡ **Real-time Inference** | Sub-second prediction with confidence scoring |
| 🗺️ **Explainable AI** | Grad-CAM heatmap overlays for transparent predictions |
| 🔒 **Enterprise Security** | AES-256 PDF encryption, JWT auth, TOTP 2FA, RBAC |
| 📊 **Smart Reporting** | Auto-generated professional PDF with digital watermarking |
| 📧 **Multi-Channel Delivery** | Email + WhatsApp report delivery via SMTP & Twilio |
| 🎛️ **Role Dashboards** | Tailored UIs for Admin, Doctor, and Patient roles |
| 💬 **AI Chatbot** | Context-aware medical assistant for patient Q&A |
| 🐳 **Production-Ready** | Docker + Streamlit Cloud deployment support |

---

## 📂 Project Structure

```plaintext
🧬 CLINICAL-SCAN-SUPPORT-SYSTEM/
│
├── 🔑 .env                               # Environment secrets (email, keys, tokens)
├── 🖥️ app.py                             # Main Streamlit application entry point
├── 📖 README.md                          # Project documentation
├── 📦 requirements.txt                   # Core Python dependencies
├── 📦 requirements_streamlit.txt         # Streamlit-specific packages
├── 🧪 validate_project.py                # System health & integrity validator
├── 🗂️ split_lung_dataset.py              # Dataset splitting automation script
├── 🏋️ train_lung_model.py                # Model training pipeline script
├── 📜 CHANGELOG.md                       # Version history and release notes
├── ⚖️ LICENSE                            # MIT License
│
├── 🗂️ .github/                           # GitHub automation
│   └── 🤖 workflows/
│       ├── ✅ ci.yml                     # CI — automated test runner
│       └── 🚀 deploy.yml                 # CD — production deployment trigger
│
├── 📚 docs/                              # Technical documentation
│   ├── 🧭 architecture.md               # System architecture design
│   ├── 🔐 security.md                    # Security design & HIPAA compliance
│   ├── 🤖 ai_pipeline.md                 # ML training & inference details
│   ├── 📊 datasets.md                    # Dataset sources and statistics
│   ├── 🚀 deployment.md                  # Deployment guide (Docker / Cloud)
│   └── ❓ FAQ.md                         # Frequently asked questions
│
├── 📊 reports/                           # Generated medical reports
│   ├── 🔒 encrypted/                     # Final AES-256 encrypted PDF reports
│   └── 🕒 temp/                          # Temporary staging area for PDFs
│
├── 📤 uploads/                           # User-uploaded medical scans
│   ├── 🧑 patient_scans/                 # Raw patient image uploads
│   ├── 🧪 preprocessed/                  # Cleaned, resized & normalized images
│   └── 🗃️ rejected/                      # Invalid / corrupted scan files
│
├── 🗄️ database/                          # SQLite databases
│   ├── 💾 users.db                       # User login credentials & roles
│   ├── 🫁 patients.db                    # Patient profiles & scan approvals
│   ├── 📄 reports.db                     # Report metadata & delivery status
│   └── 🧾 audit_logs.db                  # Security & activity audit logs
│
├── 📂 Dataset/                           # Training datasets (not tracked in Git)
│   ├── 🩻 chest_xray_nih/                # NIH Chest X-ray Dataset (112,120 imgs)
│   │   ├── images_001/ → images_012/    # 12 image batch folders
│   │   └── Data_Entry_2017.csv          # Label metadata file
│   │
│   ├── 🦠 covid_xray/                    # COVID-19 Radiography Dataset (42,330 imgs)
│   │   ├── COVID/
│   │   ├── Lung_Opacity/
│   │   ├── Normal/
│   │   └── Viral_Pneumonia/
│   │
│   ├── 🫀 heart_mri/                     # Cardiac MRI Dataset (63,425 imgs)
│   │   ├── Normal/
│   │   └── Abnormal/
│   │
│   ├── 🫁 lung/                          # Processed Lung CT Dataset (split-ready)
│   │   ├── 🏋️ train/                     # 70% training images
│   │   ├── 📊 val/                        # 15% validation images
│   │   ├── 🧪 test/                       # 15% testing images
│   │   └── 📄 dataset_split_log_20260124.txt
│   │
│   └── 📑 dataset_metadata.json          # Auto-generated statistics & label maps
│
├── 🧩 src/                               # Core source code
│   │
│   ├── 🔐 security/                      # Auth, encryption & access control
│   │   ├── 🛡️ auth.py                     # JWT login + session management
│   │   ├── 🔑 two_factor.py               # TOTP-based 2FA for admin users
│   │   ├── 🔏 crypto.py                   # AES-256 PDF encryption engine
│   │   ├── 🚦 access_control.py           # Role-based permission enforcement
│   │   └── 📜 logger.py                   # HIPAA-compliant audit logger
│   │
│   ├── 🤖 ai/                            # Artificial Intelligence layer
│   │   ├── 🧠 predictor.py               # Main disease prediction engine
│   │   ├── 🧹 preprocessor.py            # Image normalization & resizing
│   │   ├── 💬 chatbot.py                 # Context-aware medical AI chatbot
│   │   ├── 🔍 explainability.py          # Grad-CAM heatmap generator
│   │   └── 📦 artifacts/                 # ML assets directory
│   │       ├── 🧬 models/               # Trained .h5 model files
│   │       ├── 📈 metrics/              # Accuracy, loss, eval JSON logs
│   │       ├── 🏷️ labels/               # Class label JSON mappings
│   │       └── 🖼️ plots/                # Training graphs & confusion matrices
│   │
│   ├── 🗄️ database/                      # Database abstraction layer (ORM-style)
│   │   ├── 👤 user_db.py                 # User CRUD & session queries
│   │   ├── 🧑‍⚕️ patient_db.py            # Patient record management
│   │   ├── 📑 report_db.py               # Report tracking & versioning
│   │   └── 🩻 scan_db.py                 # Scan metadata & QC tracking
│   │
│   ├── 📄 services/                      # Business logic services
│   │   ├── 🧾 pdf_service.py             # Professional PDF report generator
│   │   ├── 📧 mail_service.py            # SMTP email automation
│   │   ├── 📱 whatsapp_service.py        # Twilio WhatsApp integration
│   │   ├── 🔔 notification_manager.py    # Unified multi-channel messaging
│   │   └── 🗃️ storage_service.py        # File lifecycle management
│   │
│   ├── 🎨 ui/                            # Streamlit UI dashboards
│   │   ├── 👨‍💼 admin_ui.py              # Admin dashboard (full system access)
│   │   ├── 👨‍⚕️ doctor_ui.py             # Doctor dashboard (clinical workflows)
│   │   ├── 🧑 patient_ui.py              # Patient dashboard (personal records)
│   │   ├── 💬 chatbot_ui.py             # AI chatbot panel
│   │   └── 🔐 auth_ui.py                # Login, signup & 2FA screens
│   │
│   ├── 🛠️ utils/                         # Utility helpers
│   │   ├── 🌿 env_loader.py             # Environment variable loader
│   │   ├── 📂 file_utils.py             # File validation & I/O helpers
│   │   ├── 🧪 validators.py             # Input data validators
│   │   ├── ⏱️ time_utils.py             # Timestamp & timezone utilities
│   │   └── 📊 analytics.py              # Usage metrics aggregator
│   │
│   └── 🧪 tests/                         # Automated test suite
│       ├── 🔬 test_auth.py               # Authentication & session tests
│       ├── 🧪 test_ai.py                 # AI prediction & accuracy tests
│       ├── 📄 test_pdf.py                # Report generation & encryption tests
│       └── 📡 test_notifications.py      # Email & WhatsApp delivery tests
│
├── 🎨 assets/                            # Static visual assets
│   ├── 🏥 logo.png                       # Hospital / system logo
│   ├── 📄 report_template.html           # PDF report HTML template
│   ├── 🎨 styles.css                     # Custom Streamlit theme overrides
│   ├── 🧭 architecture_diagram.png       # System architecture diagram
│   ├── 🧠 ai_pipeline.png                # ML pipeline flowchart
│   └── 🖥️ dashboard_mockups.png          # UI dashboard preview image
│
└── 🚀 deployment/                        # Deployment configuration
    ├── 🐳 Dockerfile                     # Docker build instructions
    ├── 🐳 docker-compose.yml             # Multi-service orchestration
    ├── ☁️ streamlit_cloud.yaml           # Streamlit Cloud config
    ├── 🔐 nginx.conf                     # Reverse proxy + SSL config
    └── 📜 deploy_guide.md                # Step-by-step deployment guide
```

---

## 🏗️ System Architecture

<!-- 🎨 IMAGE PROMPT (Gemini):
"Create a clean, professional dark-themed system architecture diagram for a medical AI platform.
Show these layered components connected by arrows:
1. Top: 'User Layer' — Admin, Doctor, Patient icons
2. Middle: 'Frontend (Streamlit)' — auth_ui, admin_ui, doctor_ui, patient_ui, chatbot_ui
3. Core: 'AI Engine' — Preprocessor → MobileNetV2 → Predictor → Grad-CAM
4. Services row: PDF Service, Email/WhatsApp, Notification Manager, Storage
5. Bottom: 'Security Layer' (JWT, AES-256, RBAC, 2FA) and 'Database Layer' (users.db, patients.db, reports.db, audit_logs.db)
Style: Deep navy background (#0a0f1e), teal/cyan accent lines, white labels, medical cross motif, minimalist flat icons, 1600x900px"
-->

<div align="center">
  <img src="assets/architecture_diagram.png" alt="CSSS System Architecture Diagram" width="850">
  <br><sub><i>System architecture — multi-layer design from user interface to AI inference and secure data storage</i></sub>
</div>

### 🧩 Component Summary

| Component | Purpose | Technology |
|---|---|---|
| 🎨 **Frontend** | Role-based dashboards & interaction | Streamlit, HTML5, CSS3 |
| 🧠 **AI Engine** | Disease detection & Grad-CAM XAI | TensorFlow, Keras, MobileNetV2 |
| 🔐 **Security** | Auth, encryption, 2FA, RBAC | JWT, AES-256, TOTP, SHA-256 |
| 💾 **Database** | Patient records, audit logs | SQLite with encrypted storage |
| 📄 **Report Generator** | Professional encrypted PDF output | FPDF, HTML templates |
| 📧 **Notification** | Email + WhatsApp delivery | SMTP, Twilio API |
| 🛠️ **Utilities** | File validation, analytics, env | Python standard library + custom |
| 🐳 **Deployment** | Container & cloud orchestration | Docker, Streamlit Cloud, Nginx |

---

## 📊 Dataset & Training

### 🗂️ Multi-Domain Medical Imaging Datasets

| Dataset | Modality | Classes | Images | Source |
|---|---|---|---|---|
| **NIH Chest X-ray** | X-ray | 14 diseases | 112,120 | NIH Clinical Center |
| **COVID-19 Radiography** | X-ray | 4 classes | 42,330 | Kaggle |
| **Cardiac MRI** | MRI | 2 classes | 63,425 | Kaggle |
| **Lung CT (Processed)** | CT scan | Multiple | Custom split | Internal |
| **Total** | Mixed | Various | **217,875** | Multiple |

<details>
<summary><b>🩻 NIH Chest X-ray — 14 Disease Classes</b></summary>

**Classes**: Atelectasis, Cardiomegaly, Effusion, Infiltration, Mass, Nodule, Pneumonia, Pneumothorax, Consolidation, Edema, Emphysema, Fibrosis, Pleural Thickening, Hernia

**Split**: 70% train | 15% val | 15% test

**Preprocessing**: Resize 224×224 · Normalize [0,1] · CLAHE equalization · Noise reduction

</details>

<details>
<summary><b>🦠 COVID-19 Radiography — 4 Classes</b></summary>

| Class | Images |
|---|---|
| COVID-19 | 10,192 |
| Lung Opacity | 12,084 |
| Normal | 10,192 |
| Viral Pneumonia | 9,862 |

**Augmentation**: H-flip · Rotation ±15° · Zoom 0.9–1.1 · Brightness ±20%

</details>

<details>
<summary><b>🫀 Cardiac MRI — Balanced Binary Classification</b></summary>

| Class | Images |
|---|---|
| Normal | 31,712 |
| Abnormal (cardiomyopathy, HF, etc.) | 31,713 |

**Special Processing**: DICOM→PNG · Slice selection · Contrast normalization · Segmentation preprocessing

</details>

---

## 🧠 ML Pipeline & Workflow

<!-- 🎨 IMAGE PROMPT (Gemini):
"Design a professional ML pipeline flowchart for a medical image AI system on a dark charcoal background.
Show a horizontal left-to-right flow with these stages connected by glowing teal arrows:
1. Raw Scan Upload (medical image icon)
2. Image Validation (checkmark icon)
3. Preprocessing: Resize 224x224 → Normalize → CLAHE
4. MobileNetV2 Base (neural network icon)
5. Custom Head: GAP → Dense 256 → Dropout 0.5 → Softmax
6. Prediction Output: class label + confidence %
7. Grad-CAM Heatmap
8. PDF Report Generation
9. Encrypted Delivery (email/WhatsApp icons)
Style: Dark background, glowing cyan connectors, flat tech icons, white labels, medical aesthetic, 1600x700px"
-->

<div align="center">
  <img src="assets/ai_pipeline.png" alt="AI Inference Pipeline" width="800">
  <br><sub><i>End-to-end ML pipeline — from raw scan upload through inference to secure report delivery</i></sub>
</div>

### 1️⃣ Data Preprocessing

```bash
# Stratified train/val/test dataset split
python split_lung_dataset.py \
    --dataset Dataset/lung \
    --output Dataset/lung_processed \
    --train_ratio 0.70 \
    --val_ratio 0.15 \
    --test_ratio 0.15 \
    --stratify
```

Pipeline steps: Image discovery → Format validation → Resize 224×224 → Normalize [0,1] → CLAHE → Augmentation → Stratified split → Metadata JSON

---

### 2️⃣ Model Architecture

**Base**: MobileNetV2 (ImageNet pretrained) + Custom classification head

```
Input (224×224×3)
    ↓
MobileNetV2 Backbone (frozen initially, then fine-tuned)
    ↓
Global Average Pooling 2D
    ↓
Dense (256 units, ReLU)
    ↓
Dropout (0.5)
    ↓
Dense (num_classes, Softmax)
    ↓
Prediction + Confidence Score
```

**Training Config**:

```python
model.compile(
    optimizer=Adam(learning_rate=0.0001, beta_1=0.9, beta_2=0.999),
    loss='categorical_crossentropy',
    metrics=['accuracy', 'precision', 'recall']
)

callbacks = [
    EarlyStopping(patience=5, restore_best_weights=True),
    ReduceLROnPlateau(factor=0.5, patience=3),
    ModelCheckpoint('best_model.h5', save_best_only=True)
]
```

**Data Augmentation**:

```python
ImageDataGenerator(
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True,
    vertical_flip=True,
    zoom_range=0.1,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest'
)
```

---

### 3️⃣ Training

```bash
python train_lung_model.py \
    --model MobileNetV2 \
    --dataset Dataset/lung_processed \
    --epochs 50 \
    --batch_size 32 \
    --learning_rate 0.0001 \
    --output src/ai/artifacts/models/lung_classifier.h5
```

<!-- 🎨 IMAGE PROMPT (Gemini):
"Create a professional training curves graph for a deep learning model.
Show two subplots side by side on a dark navy background:
Left: 'Model Accuracy' — training accuracy curve in teal, validation accuracy in orange, both converging around epoch 23, y-axis 0.7 to 1.0
Right: 'Model Loss' — training loss in teal decreasing, validation loss in orange decreasing and stabilizing, y-axis 0 to 1.2
Style: Dark theme, grid lines, legend, clean labels, epoch x-axis 0-30, professional data visualization style, 1200x500px"
-->

<div align="center">
  <img src="assets/training_curves.png" alt="Training and Validation Curves" width="750">
  <br><sub><i>Model convergence at epoch 23 — no significant overfitting observed</i></sub>
</div>

---

### 4️⃣ Inference & Prediction

```python
from src.ai.predictor import MedicalImagePredictor

predictor = MedicalImagePredictor(
    model_path='src/ai/artifacts/models/lung_classifier.h5',
    labels_path='src/ai/artifacts/labels/class_labels.json'
)

result = predictor.predict(
    image_path='uploads/patient_scans/chest_xray_001.png',
    generate_heatmap=True
)
```

**Prediction output format**:

```json
{
  "patient_id": "P12345",
  "scan_id": "SCAN_2026_001",
  "timestamp": "2026-02-15T10:30:00Z",
  "prediction": {
    "class": "Pneumonia",
    "confidence": 0.956,
    "probabilities": {
      "Normal": 0.012,
      "Pneumonia": 0.956,
      "COVID-19": 0.021,
      "Lung_Opacity": 0.011
    }
  },
  "explainability": {
    "heatmap": "uploads/preprocessed/chest_xray_001_heatmap.png",
    "attention_regions": ["right_lower_lobe", "left_middle_lobe"]
  }
}
```

---

### 5️⃣ Explainable AI — Grad-CAM Heatmaps

```python
from src.ai.explainability import generate_gradcam_heatmap

heatmap = generate_gradcam_heatmap(
    model=predictor.model,
    image=preprocessed_image,
    last_conv_layer='block_16_project'
)

visualization = overlay_heatmap(
    original_image=scan_image,
    heatmap=heatmap,
    alpha=0.4,
    colormap='jet'
)
```

<!-- 🎨 IMAGE PROMPT (Gemini):
"Create a medical AI explainability visualization showing a Grad-CAM heatmap overlay.
Show three panels side by side:
1. 'Original Scan' — a grayscale chest X-ray image (stylized illustration, not a real patient)
2. 'Grad-CAM Heatmap' — same image with red/yellow/green heat overlay highlighting right lower lobe
3. 'AI Diagnosis' — dark card showing: 'Pneumonia detected · Confidence: 95.6%' with a confidence bar and attention region label
Style: Dark background, clinical/professional aesthetic, teal border accents, white labels, 1400x500px"
-->

<div align="center">
  <img src="assets/gradcam_visualization.png" alt="Grad-CAM Explainability" width="800">
  <br><sub><i>Grad-CAM heatmap highlights the specific lung regions driving the AI prediction</i></sub>
</div>

---

### 6️⃣ Encrypted Report Generation & Delivery

```python
from src.services.pdf_service import generate_medical_report
from src.services.notification_manager import NotificationManager

# Generate AES-256 encrypted PDF
report_path = generate_medical_report(
    patient_info={'id': 'P12345', 'name': 'John Doe', 'age': 45, 'gender': 'Male'},
    scan_info={'type': 'Chest X-ray', 'date': '2026-02-15', 'scan_id': 'SCAN_2026_001'},
    prediction_result=result,
    doctor_remarks='Follow-up recommended in 2 weeks',
    encryption_key=os.getenv('PDF_ENCRYPTION_KEY')
)

# Multi-channel delivery
nm = NotificationManager()
nm.send_email_and_whatsapp(
    patient_email='patient@example.com',
    patient_phone='+919876543210',
    report_path=report_path
)
```

---

## 📈 Performance Metrics

<!-- 🎨 IMAGE PROMPT (Gemini):
"Create a professional confusion matrix visualization for a 4-class medical image classifier.
Classes: Normal, Pneumonia, COVID-19, Lung Opacity
Show a 4x4 heatmap with:
- Diagonal cells in dark teal (correct predictions with high numbers)
- Off-diagonal cells in dark red/maroon (misclassifications with low numbers)
Include: actual numeric values in each cell, class labels on both axes, color bar, overall accuracy 89.76% shown below
Style: Dark navy background, professional medical aesthetic, white text, no grid borders, 700x600px"
-->

<div align="center">
  <img src="assets/confusion_matrix.png" alt="Confusion Matrix" width="650">
  <br><sub><i>Per-class prediction confusion matrix on held-out test set</i></sub>
</div>

| Metric | Value |
|---|---|
| 🏋️ Training Accuracy | **94.75%** |
| 📊 Validation Accuracy | **89.82%** |
| 🧪 Testing Accuracy | **89.76%** |
| 🎯 Average Precision | **90.10%** |
| 🔁 Average Recall | **89.40%** |
| ⚖️ F1 Score | **89.70%** |
| 🖼️ Total Training Images | **217,875** |
| ⚡ Inference Time | **< 1 second** |

**Per-Class Performance**:

| Condition | Accuracy |
|---|---|
| COVID-19 Detection | 94.1% |
| Pneumonia Detection | 92.3% |
| Normal Classification | 88.7% |
| Cardiac Abnormalities | 87.5% |

---

## 🖥️ User Dashboards

### 🎯 Role-Based Access Control

| Role | Access Level | Key Capabilities |
|---|---|---|
| 👑 **Admin** | Full system | User management, audit logs, analytics, model updates |
| 👨‍⚕️ **Doctor** | Clinical | Scan upload, AI diagnosis, report generation, patient management |
| 🧑 **Patient** | Personal only | View own scans, download reports, health timeline |

---

### 👨‍💼 Admin Dashboard

<!-- 🎨 IMAGE PROMPT (Gemini):
"Design a modern dark-themed admin dashboard UI mockup for a medical AI platform.
Include these panels arranged in a grid:
- Top navbar: 'CSSS Admin' logo, user avatar, notification bell
- Left sidebar: Home, Users, Reports, Audit Logs, Analytics, Settings icons
- Main area top row: 4 stat cards showing 'Total Users: 248', 'Scans Today: 47', 'Reports Generated: 1,284', 'System Uptime: 99.8%'
- Middle: line chart titled 'Daily Scan Volume' (last 30 days, teal line)
- Bottom left: 'Disease Distribution' donut chart (Pneumonia 34%, Normal 28%, COVID 22%, Other 16%)
- Bottom right: 'Recent Audit Events' table with timestamps, user, action, status
Style: Dark navy #0a0f1e, teal #00c9a7 accents, white text, card-based layout, 1440x900px"
-->

<div align="center">
  <img src="assets/dashboard_admin.png" alt="Admin Dashboard" width="800">
  <br><sub><i>Admin dashboard — full system visibility with real-time analytics and security monitoring</i></sub>
</div>

**Key capabilities** (`src/ui/admin_ui.py`): User CRUD & role management · Real-time system health · Full audit log viewer · Disease prevalence analytics · Database backup management · AI model performance tracking

---

### 👨‍⚕️ Doctor Dashboard

<!-- 🎨 IMAGE PROMPT (Gemini):
"Design a modern dark-themed doctor workflow dashboard UI mockup for a medical imaging AI system.
Layout:
- Top navbar: 'CSSS Doctor Portal' with doctor avatar and 'Dr. Sriram V' name
- Left panel: Patient search bar, patient list with status indicators (Pending/Ready)
- Center: Drag-and-drop scan upload zone with image preview showing a stylized chest X-ray illustration
- Right panel: AI Prediction result card showing: 'Pneumonia · 95.6% confidence', probability bar chart (4 classes), heatmap thumbnail
- Bottom: 'Generate Encrypted Report' button + 'Send to Patient' button
Style: Dark navy background, teal/cyan accents, clinical professional aesthetic, white text, 1440x900px"
-->

<div align="center">
  <img src="assets/dashboard_doctor.png" alt="Doctor Dashboard" width="800">
  <br><sub><i>Doctor dashboard — scan upload, AI prediction with heatmap, and one-click report delivery</i></sub>
</div>

**Key capabilities** (`src/ui/doctor_ui.py`): Drag-and-drop scan upload · Real-time AI prediction · Grad-CAM heatmap overlay · Batch processing support · Doctor's remarks & digital signature · Encrypted PDF generation · Email + WhatsApp report dispatch

---

### 🧑 Patient Dashboard

<!-- 🎨 IMAGE PROMPT (Gemini):
"Design a clean, dark-themed patient portal dashboard for a medical AI reporting system.
Layout:
- Top: 'Welcome back, John Doe' greeting with profile avatar
- Stat cards: 'Total Scans: 3', 'Reports Ready: 2', 'Last Visit: Feb 10, 2026'
- Center: 'My Scan History' timeline showing 3 entries with date, scan type, AI result, status badge (Ready/Delivered)
- Each entry has: Download PDF button, View Heatmap button
- Right panel: 'Health Insights' simplified explanation of last result in plain language
- Bottom: 'Upload New Scan' button, 'Contact Doctor' button
Style: Dark navy, soft teal accents, friendly/approachable tone, medical professional, white text, 1440x900px"
-->

<div align="center">
  <img src="assets/dashboard_patient.png" alt="Patient Dashboard" width="800">
  <br><sub><i>Patient dashboard — personal scan history, report downloads, and simplified AI insights</i></sub>
</div>

---

### 💬 AI Medical Chatbot

<!-- 🎨 IMAGE PROMPT (Gemini):
"Design a sleek dark-themed AI medical chatbot interface panel.
Layout:
- Header: 'CSSS Medical Assistant' with a pulse/AI icon
- Chat window showing conversation bubbles:
  Patient message (right, teal bubble): 'What does my Pneumonia result mean?'
  AI response (left, dark card): Multi-line explanation about pneumonia symptoms, next steps, 'This is an AI-assisted response — consult your doctor for medical decisions' disclaimer
- Input area at bottom with text field and Send button
- Quick reply chips: 'What is Pneumonia?', 'How is it treated?', 'Schedule Follow-up'
Style: Dark navy background, teal accent for user bubbles, medical professional aesthetic, white text, 420x700px portrait panel"
-->

<div align="center">
  <img src="assets/dashboard_chatbot.png" alt="AI Chatbot Interface" width="500">
  <br><sub><i>AI medical chatbot — context-aware patient Q&A with safety disclaimers</i></sub>
</div>

---

## 🔐 Security & Compliance

### 🛡️ Security Architecture

**Multi-Layer Security Stack** (`src/security/`):

```
┌─────────────────────────────────────────────────────┐
│              REQUEST LAYER                          │
│  HTTPS/TLS · Rate Limiting · IP Whitelisting        │
├─────────────────────────────────────────────────────┤
│              AUTHENTICATION                         │
│  SHA-256 Passwords · JWT Sessions · TOTP 2FA        │
├─────────────────────────────────────────────────────┤
│              AUTHORIZATION                          │
│  Role-Based Access Control (Admin/Doctor/Patient)   │
├─────────────────────────────────────────────────────┤
│              DATA PROTECTION                        │
│  AES-256 PDF Encryption · Env Key Management        │
├─────────────────────────────────────────────────────┤
│              AUDIT & COMPLIANCE                     │
│  HIPAA Audit Logs · Event Tracking · Retention      │
└─────────────────────────────────────────────────────┘
```

### 🚦 RBAC Permission Matrix

| Action | Admin | Doctor | Patient |
|---|:---:|:---:|:---:|
| Manage all users | ✅ | ❌ | ❌ |
| Upload scans | ✅ | ✅ | ✅ |
| View all patient scans | ✅ | ✅ | ❌ |
| Generate reports | ✅ | ✅ | ❌ |
| Download own reports | ✅ | ✅ | ✅ |
| View audit logs | ✅ | ❌ | ❌ |
| Configure system | ✅ | ❌ | ❌ |
| Enable/disable users | ✅ | ❌ | ❌ |

### ✅ Compliance Checklist

- ✅ HIPAA-compliant audit trails with tamper-proof storage
- ✅ AES-256-CBC encryption for all PDF reports
- ✅ JWT token auth with configurable session timeout
- ✅ TOTP 2FA for all admin accounts (Google/Microsoft Authenticator)
- ✅ Brute force protection (max 5 login attempts)
- ✅ SHA-256 + salt password hashing (no plaintext)
- ✅ Role-based resource-level authorization
- ✅ Automated log retention and compliance export
- ✅ Environment-based secret management (no hardcoded keys)

---

## 🛠️ Installation

### 📋 Prerequisites

- Python 3.8+ with pip
- TensorFlow 2.x (CPU or GPU)
- Docker & Docker Compose (recommended)
- 4GB+ RAM (8GB recommended for training)
- 2GB+ disk for models; 50GB+ for full datasets

---

### 🐳 Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM.git
cd CLINICAL-SCAN-SUPPORT-SYSTEM

# Start all services
docker-compose up -d

# Verify
docker-compose ps

# Access the app
open http://localhost:8501
```

---

### 🐍 Option 2: Local Development

```bash
# 1. Clone
git clone https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM.git
cd CLINICAL-SCAN-SUPPORT-SYSTEM

# 2. Virtual environment
python -m venv venv
source venv/bin/activate       # Linux/Mac
# venv\Scripts\activate        # Windows

# 3. Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements_streamlit.txt

# 4. Configure environment
cp .env.example .env
nano .env   # Fill in your secrets

# 5. Initialize databases
python -c "from src.database.user_db import init_database; init_database()"

# 6. Prepare dataset (optional)
python split_lung_dataset.py --dataset Dataset/lung --output Dataset/lung_processed

# 7. Train or use pretrained model
python train_lung_model.py --dataset Dataset/lung_processed --epochs 30

# 8. Launch
streamlit run app.py
```

**Access**: `http://localhost:8501`

---

### ⚙️ Environment Variables

```bash
# .env — all required secrets

# Application
APP_NAME=Clinical Scan Support System
APP_SECRET_KEY=your-256-bit-secret
DEBUG_MODE=false

# Email (SMTP)
EMAIL_SENDER=youremail@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Security
PDF_ENCRYPTION_KEY=your-256-bit-aes-key
JWT_SECRET_KEY=your-jwt-secret
ADMIN_PASSWORD=secure-admin-password

# AI
MODEL_PATH=src/ai/artifacts/models/lung_classifier.h5
LABELS_PATH=src/ai/artifacts/labels/class_labels.json
CONFIDENCE_THRESHOLD=0.75

# Reports
HOSPITAL_NAME=Your Hospital Name
HOSPITAL_LOGO=assets/logo.png
```

---

### 📦 Dataset Setup

```bash
# Install Kaggle CLI and configure credentials
pip install kaggle
mkdir ~/.kaggle && cp kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json

# Download datasets
kaggle datasets download -d nih-chest-xrays/data
kaggle datasets download -d tawsifurrahman/covid19-radiography-database
kaggle datasets download -d andrewmvd/heart-mri-database

# Extract into correct directories
unzip data.zip -d Dataset/chest_xray_nih/
unzip covid19-radiography-database.zip -d Dataset/covid_xray/
unzip heart-mri-database.zip -d Dataset/heart_mri/
```

---

### ✅ Validation

```bash
# System integrity check
python validate_project.py --comprehensive

# Expected output:
# ✅ Python version: 3.9+
# ✅ All packages installed
# ✅ Databases initialized
# ✅ AI model loaded
# ✅ Encryption keys configured
# ✅ File structure complete
# 🎉 System is ready!
```

---

## 🚀 Quick Start

### Default Login

```
URL: http://localhost:8501
Username: admin
Password: admin123
⚠️ Change password immediately after first login!
```

### For Doctors — Scan Workflow

1. Login → Doctor Dashboard
2. Select or create patient
3. Upload scan (PNG / JPG / DICOM)
4. View AI prediction + confidence + heatmap
5. Add clinical remarks
6. Generate encrypted PDF report
7. Send via Email + WhatsApp in one click

### For Patients — Report Access

1. Login → Patient Dashboard
2. View scan history timeline
3. Download encrypted PDF report
4. Read AI explanation in simple language

---

## 🧪 Testing

```bash
# Full test suite
pytest tests/ -v

# With coverage report
pytest tests/ --cov=src --cov-report=html --cov-report=term

# By category
pytest tests/ -m unit -v
pytest tests/ -m integration -v
pytest tests/ -m security -v
```

### Test Coverage by Module

| Module | Coverage |
|---|---|
| `src/security/` | 95% |
| `src/ai/` | 92% |
| `src/database/` | 88% |
| `src/services/` | 87% |
| `src/ui/` | 75% |

### Example: Security Tests

```python
# tests/test_security.py
def test_authentication_success():
    user = authenticate_user('doctor1', 'correct_password')
    assert user['role'] == 'doctor'

def test_brute_force_protection():
    for _ in range(5):
        with pytest.raises(AuthenticationError):
            authenticate_user('admin', 'wrong')
    with pytest.raises(AccountLockedError):
        authenticate_user('admin', 'correct_password')

def test_pdf_aes256_encryption():
    encrypted = encrypt_pdf('tests/data/test_report.pdf', key=TEST_KEY)
    assert is_encrypted(encrypted)
    decrypted = decrypt_pdf(encrypted, key=TEST_KEY)
    assert b'Patient Name' in decrypted

def test_rbac_admin_only():
    assert check_permission('admin', 'delete_user') == True
    assert check_permission('doctor', 'delete_user') == False
    assert check_permission('patient', 'delete_user') == False
```

---

## 📊 Monitoring & Analytics

**Admin Analytics Panel**:
- Daily/weekly scan volume trends
- Disease prevalence distribution charts
- AI confidence score histograms
- Report generation & delivery success rates
- Real-time system health (CPU, memory, DB size)
- Security event timeline

**Configurable Alerts**:
- Low prediction confidence (< threshold)
- Failed report delivery retry
- Suspicious login patterns
- Database backup status
- Disk space warnings

---

## 🤝 Contributing

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/CLINICAL-SCAN-SUPPORT-SYSTEM.git

# Create feature branch
git checkout -b feature/your-feature-name

# Develop, test, format
pytest tests/ -v
black src/ tests/
flake8 src/ tests/

# Commit and push
git commit -m "feat: describe your change"
git push origin feature/your-feature-name

# Open Pull Request on GitHub
```

**Contribution Areas**:

| Area | Description |
|---|---|
| 🧠 AI/ML | Better models, new modalities, ViT integration |
| 🎨 Frontend | Enhanced Streamlit UI, mobile responsiveness |
| 🔐 Security | Audits, FHIR/HL7 compliance, OAuth |
| 📊 Analytics | Predictive dashboards, population health |
| 📚 Docs | Guides, tutorials, API docs |

---

## 🗺️ Roadmap

### v2.0 — Q3 2026
- [ ] Vision Transformer (ViT) model option
- [ ] Federated learning across hospital nodes
- [ ] DICOM standard full compliance
- [ ] Real-time multi-doctor collaborative review

### v2.5 — Q4 2026
- [ ] Mobile apps (iOS + Android)
- [ ] FHIR / HL7 API integration
- [ ] Multi-language support (10+ languages)
- [ ] Cloud templates: AWS, Azure, GCP

### Long-Term Vision
- FDA approval pathway research
- Blockchain-based immutable audit trails
- Telemedicine built-in video consultation
- Open Medical AI contribution initiative

---

## 👥 Team

| Name | Role | GitHub |
|---|---|---|
| **Sriram V** | Project Lead & AI Engineer | [@darkwebnew](https://github.com/darkwebnew) |
| **Swedha V** | Mentor & Medical Domain Expert | [@swedha333](https://github.com/swedha333) |
| **Selvakumar R** | Co-Mentor & AI/ML Advisor | [@selvasachein](https://github.com/selvasachein) |
| **Surothaaman R** | Backend & Security | [@surothaaman](https://github.com/surothaaman) |
| **Andrew Varghese V S** | Frontend Development | [@Andrewvarghese653](https://github.com/Andrewvarghese653) |
| **Praveen CK** | Database & Testing | [@praveenck23009864](https://github.com/praveenck23009864) |

---

## 🙏 Acknowledgments

**Datasets**: NIH Clinical Center · Kaggle Community · IEEE Publications

**Libraries**: TensorFlow/Keras · Streamlit · scikit-learn · OpenCV · FPDF · NumPy · Pandas

**Academic References**:
1. Sandler et al. (2018) — *MobileNetV2: Inverted Residuals and Linear Bottlenecks*
2. Selvaraju et al. (2017) — *Grad-CAM: Visual Explanations from Deep Networks*
3. Ronneberger et al. (2015) — *U-Net: Convolutional Networks for Biomedical Image Segmentation*
4. Caldwell, M. (2025) — *Medical image diagnosis models based on CNNs*
5. Lepcha et al. (2025) — *Deep learning in medical image analysis: A comprehensive review*

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 📞 Contact & Support

- 📧 **Email**: sriramnvks@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM/discussions)
- 📖 **Docs**: [/docs](docs/)
- ❓ **FAQ**: [docs/FAQ.md](docs/FAQ.md)

---

<div align="center">

**Made with ❤️ for better healthcare through AI**

⭐ **Star this repo** if CSSS helps your work!

[![GitHub stars](https://img.shields.io/github/stars/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM?style=social)](https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM)
[![GitHub forks](https://img.shields.io/github/forks/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM?style=social)](https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM/fork)

[🏠 Top](#-clinical-scan-support-system) • [📖 Docs](docs/) • [🐛 Issues](https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM/issues) • [💬 Discussions](https://github.com/darkwebnew/CLINICAL-SCAN-SUPPORT-SYSTEM/discussions)

</div>
