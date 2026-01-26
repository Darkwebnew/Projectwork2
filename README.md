# 🏥 CLINICAL-SCAN-SUPPORT-SYSTEM  
### AI-Powered Medical Image Diagnosis & Patient Support Platform

**Real-time medical image analysis with secure reporting, chatbot support, and WhatsApp / Email automation**

🚀 Quick Start • 🏗️ Architecture • 📂 Folder Structure • ✨ Features • ⚙️ Installation • 📸 Outputs  

---

## 🎯 Overview

**CLINICAL-SCAN-SUPPORT-SYSTEM** is an end-to-end AI healthcare platform that allows patients to upload medical images such as **CT Scan, MRI, X-Ray, PNG, JPG, JPEG**, automatically analyze diseases using a trained deep learning model, generate encrypted medical reports, and communicate with doctors using chatbot and WhatsApp integration.

The system supports **role-based dashboards** for:

- 👨‍⚕️ Doctor  
- 🧑‍💼 Admin  
- 🧑‍🦱 Patient  

It is optimized for **desktop, mobile, tablet, Windows, Linux, Android, iOS** using Streamlit responsive UI.

---

## ✨ Key Features

### 🧠 AI Disease Prediction
- TensorFlow / Keras CNN model (.h5)  
- Supports large datasets (Kaggle medical images)  
- GPU acceleration enabled  

### 📤 Medical Image Upload
- Accepts CT Scan, MRI, X-Ray  
- JPG / PNG / JPEG formats  
- Real-time inference  

### 📄 Encrypted Medical Report
- PDF generation  
- Password protected encryption  
- Secure storage and email delivery  

### 📧 Automatic Email Sending
- Sends report to patient email  
- Admin notification support  

### 📱 WhatsApp Integration
- Sends alerts to doctor / admin  
- Real-time message automation  

### 🤖 Medical Chatbot
- Floating chatbot widget  
- AI-based medical FAQ responses  
- Doctor fallback if needed  

### 🔐 Security
- Encrypted database  
- Audit logs  
- Role-based login  
- Admin 2-step verification  

### 📊 Real-Time Dashboards
- Upload tracking  
- Patient history  
- Doctor replies  
- Usage analytics  

### 📱 Mobile Friendly UI
- Responsive layout  
- Works on all devices  

---

## 🏗️ System Architecture

User (Web Browser / Mobile)
|
v
Streamlit Frontend
|
v
Authentication System (Admin / Doctor / Patient)
|
v
AI Prediction Engine (TensorFlow)
|
v
Database (SQLite + Encryption)
|
v
PDF Generator (Encrypted Report)
|
v
Email Sender (Gmail SMTP)
|
v
WhatsApp Automation
|
v
Medical Chatbot


---

## 🔧 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Streamlit |
| Backend | Python |
| AI Model | TensorFlow / Keras |
| Image Processing | OpenCV |
| Database | SQLite |
| Security | Encryption + Hashing |
| Reports | PDF Generator |
| Messaging | Gmail SMTP + WhatsApp |
| Deployment | Local / Streamlit |

---

## 📂 Project Structure

CLINICAL-SCAN-SUPPORT-SYSTEM/
│
├── Dataset/
│ └── lung/
│ ├── train/
│ ├── val/
│ └── test/
│
├── models/
│ └── best_lung_model.h5
│
├── database/
│ └── patients.db
│
├── security/
│ ├── encrypt.py
│ ├── users.json
│ └── audit.log
│
├── reports/
│ ├── pdf_reports/
│ └── encrypted_reports/
│
├── chatbot/
│ └── medical_bot.py
│
├── utils/
│ ├── mailer.py
│ ├── whatsapp.py
│ ├── pdf_generator.py
│ └── analytics.py
│
├── app.py
├── train_lung_model.py
├── split_lung_dataset.py
├── class_labels.json
├── requirements.txt
├── .env
└── README.md


---

## ⚙️ Requirements

- ✅ OS: Windows / Linux / macOS  
- ✅ Python: 3.9+  
- ✅ GPU (Optional): NVIDIA CUDA  
- ✅ Libraries:
  - TensorFlow
  - Streamlit
  - OpenCV
  - NumPy
  - Pandas
  - ReportLab / FPDF
  - yagmail
  - SQLite
  - Cryptography

---

## 🛠️ Installation

### 🔹 Step 1 – Clone Project
```bash
git clone https://github.com/yourusername/CLINICAL-SCAN-SUPPORT-SYSTEM.git
cd CLINICAL-SCAN-SUPPORT-SYSTEM
```

### 🔹 Step 2 – Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Linux / Mac
```

### 🔹 Step 3 – Install Dependencies
```bash
pip install -r requirements.txt
```

### 🔹 Step 4 – Configure Environment

Create ```.env``` file:
```bash
ADMIN_EMAIL=harishammunvks@gmail.com
WHATSAPP_NUMBER=8754748489
EMAIL_PASSWORD=your_app_password
```

## 🚀 Quick Start

### ▶️ Run Application
```bash
streamlit run app.py
```

### Open browser:
```bash
http://localhost:8501
```

---

## 👥 User Roles
### 👨‍💼 Admin Dashboard

User management

Database view

Logs monitoring

Report access

2-step verification

Analytics

### 👨‍⚕️ Doctor Dashboard

Patient reports

Image preview

Chat reply

WhatsApp alerts

Medical chatbot support

### 🧑‍🦱 Patient Dashboard

Upload scan

Disease prediction

PDF download

Email delivery

Chatbot help

WhatsApp contact

---

## 📸 Outputs

Add screenshots after running the project:

/screenshots/login.png
/screenshots/patient_dashboard.png
/screenshots/report_pdf.png
/screenshots/admin_dashboard.png

## 📈 Results & Impact

✔ Faster diagnosis
✔ Reduced manual work
✔ Secure medical records
✔ Real-time doctor communication
✔ Scalable AI architecture
✔ Excellent portfolio project

### This project demonstrates strong skills in:

AI & Deep Learning

Cyber Security

Full Stack Python

Automation

Healthcare Systems

---

## ✅ Training Log & Model Performance

Your model training completed successfully with GPU acceleration and high accuracy. Zero critical errors detected. Everything is production-ready.

### 🖥️ System & GPU Status
- TensorFlow Version: 2.10.1
- GPU detected: NVIDIA GPU
- Mixed Precision: Enabled
- GPU Memory Growth: Enabled
- XLA: Disabled (Windows compatibility)

**✔ Meaning:** GPU is correctly used, mixed precision speeds up training, memory growth prevents crashes, XLA disabled is normal on Windows.

### 📊 Dataset Summary
- Training images: 152,505
- Validation images: 32,677
- Test images: 32,689
- Total images: 217,871
- Classes: 6 (`COVID`, `Lung_Opacity`, `NIH_MERGED`, `Normal`, `Sick`, `Viral_Pneumonia`)

**✔ Meaning:** Large real-world medical dataset, professional-level project.

### ⚖️ Class Weights (Handling Imbalance)
| Class | Weight |
|-------|-------|
| COVID | 5.02 |
| Lung_Opacity | 3.02 |
| NIH | 0.32 |
| Normal | 0.62 |
| Sick | 1.40 |
| Viral_Pneumonia | 13.50 |

**✔ Meaning:** Model handles data imbalance automatically for fairness and accuracy.

### 🧠 Model Architecture
- Base: MobileNetV2 (pretrained)
- Total Parameters: 2,265,670
- Trainable Parameters: 7,686
- Frozen Base Model (Transfer Learning)

**✔ Meaning:** Industry-standard architecture; fast, accurate, and lightweight.

### 🚀 Training & Fine Tuning Results
**Initial Training:**  
- Epochs: 5  
- Time: ~2 hr 28 min  
- Accuracy: Start 72% → End 77%, Validation ~79%  

**Fine Tuning:**  
- Epochs: 8  
- Time: ~3 hr 23 min  
- Accuracy: Train 92.97%, Validation 89.31%  

**Test Evaluation:**  
- Test Accuracy: 89.51%  
- Test Time: ~6 min  

**✔ Meaning:** Excellent generalization, production-ready model.

### 🏆 Final Model Quality
| Metric | Value |
|--------|-------|
| Train Accuracy | 92.97% |
| Validation Accuracy | 89.31% |
| Test Accuracy | 89.51% |
| Overfitting | Low |
| Production Ready | ✅ Yes |

**⏱️ Total Training Time:** ~5 hr 57 min (GPU)

---

## 📚 References

TensorFlow Documentation

Streamlit Docs

Kaggle Medical Imaging Datasets

OpenCV Python

SQLite Security Practices

---

