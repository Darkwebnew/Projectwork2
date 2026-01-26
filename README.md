🏥 CLINICAL-SCAN-SUPPORT-SYSTEM
AI-Powered Medical Image Diagnosis & Patient Support Platform
<div align="center">










Real-time medical image analysis with secure reporting, chatbot support, and WhatsApp / Email automation

🚀 Quick Start
 •
🏗️ Architecture
 •
📂 Folder Structure
 •
✨ Features
 •
⚙️ Installation
 •
📸 Outputs

</div>
🎯 Overview

CLINICAL-SCAN-SUPPORT-SYSTEM is an end-to-end AI healthcare platform that allows patients to upload medical images such as CT Scan, MRI, X-Ray, PNG, JPG, JPEG, automatically analyze diseases using a trained deep learning model, generate encrypted medical reports, and communicate with doctors using chatbot and WhatsApp integration.

The system supports role-based dashboards for:

👨‍⚕️ Doctor

🧑‍💼 Admin

🧑‍🦱 Patient

It is optimized for desktop, mobile, tablet, Windows, Linux, Android, iOS using Streamlit responsive UI.

✨ Key Features

🧠 AI Disease Prediction

TensorFlow / Keras CNN model (.h5)

Supports large datasets (Kaggle medical images)

GPU acceleration enabled

📤 Medical Image Upload

Accepts CT Scan, MRI, X-Ray

JPG / PNG / JPEG formats

Real-time inference

📄 Encrypted Medical Report

PDF generation

Password protected encryption

Secure storage and email delivery

📧 Automatic Email Sending

Sends report to patient email

Admin notification support

📱 WhatsApp Integration

Sends alerts to doctor / admin

Real-time message automation

🤖 Medical Chatbot

Floating chatbot widget

AI-based medical FAQ responses

Doctor fallback if needed

🔐 Security

Encrypted database

Audit logs

Role-based login

Admin 2-step verification

📊 Real-Time Dashboards

Upload tracking

Patient history

Doctor replies

Usage analytics

📱 Mobile Friendly UI

Responsive layout

Works on all devices

🏗️ System Architecture
User (Web Browser / Mobile)
        |
        v
 Streamlit Frontend
        |
        v
Authentication System
(Admin / Doctor / Patient)
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

🔧 Technology Stack
Layer	Technology
Frontend	Streamlit
Backend	Python
AI Model	TensorFlow / Keras
Image Processing	OpenCV
Database	SQLite
Security	Encryption + Hashing
Reports	PDF Generator
Messaging	Gmail SMTP + WhatsApp
Deployment	Local / Streamlit Cloud
📂 Project Structure
CLINICAL-SCAN-SUPPORT-SYSTEM/
│
├── Dataset/
│   └── lung/
│       ├── train/
│       ├── val/
│       └── test/
│
├── models/
│   └── best_lung_model.h5
│
├── database/
│   └── patients.db
│
├── security/
│   ├── encrypt.py
│   ├── users.json
│   └── audit.log
│
├── reports/
│   ├── pdf_reports/
│   └── encrypted_reports/
│
├── chatbot/
│   └── medical_bot.py
│
├── utils/
│   ├── mailer.py
│   ├── whatsapp.py
│   ├── pdf_generator.py
│   └── analytics.py
│
├── app.py
├── train_lung_model.py
├── split_lung_dataset.py
├── class_labels.json
├── requirements.txt
├── .env
└── README.md

⚙️ Requirements

✅ OS: Windows / Linux / macOS

✅ Python: 3.9+

✅ GPU (optional): NVIDIA CUDA

✅ Libraries:

TensorFlow

Streamlit

OpenCV

NumPy

Pandas

ReportLab / FPDF

yagmail

SQLite

Cryptography

🛠️ Installation
🔹 Step 1 – Clone Project
git clone https://github.com/yourusername/CLINICAL-SCAN-SUPPORT-SYSTEM.git
cd CLINICAL-SCAN-SUPPORT-SYSTEM

🔹 Step 2 – Create Virtual Environment
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux / Mac

🔹 Step 3 – Install Dependencies
pip install -r requirements.txt

🔹 Step 4 – Configure Environment

Create .env file:

ADMIN_EMAIL=harishammunvks@gmail.com
WHATSAPP_NUMBER=8754748489
EMAIL_PASSWORD=your_app_password

🚀 Quick Start
▶️ Run Application
streamlit run app.py


Open browser:

http://localhost:8501

👥 User Roles
👨‍💼 Admin Dashboard

User management

Database view

Logs monitoring

Report access

2-step verification

Analytics

👨‍⚕️ Doctor Dashboard

Patient reports

Image preview

Chat reply

WhatsApp alerts

Medical chatbot support

🧑‍🦱 Patient Dashboard

Upload scan

Disease prediction

PDF download

Email delivery

Chatbot help

WhatsApp contact

📸 Outputs

Add screenshots here after running project

/screenshots/login.png
/screenshots/patient_dashboard.png
/screenshots/report_pdf.png
/screenshots/admin_dashboard.png


Example:

![Login Page](screenshots/login.png)

📈 Results & Impact

✔ Faster diagnosis

✔ Reduced manual work

✔ Secure medical records

✔ Real-time doctor communication

✔ Scalable AI architecture

✔ Excellent portfolio project

This project demonstrates strong skills in:

AI & Deep Learning

Cyber Security

Full Stack Python

Automation

Healthcare Systems

📚 References

TensorFlow Documentation

Streamlit Docs

Kaggle Medical Imaging Datasets

OpenCV Python

SQLite Security Practices
