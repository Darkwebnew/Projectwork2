<div align="center">

# 🧬 CLINICAL SCAN SUPPORT SYSTEM  

### AI-Powered Medical Image Diagnosis & Clinical Decision Support Platform

Secure, intelligent, and automated lung disease diagnosis using deep learning

🚀 **Quick Start** • 🏗️ **Architecture** • 🧠 **AI Model** • 🔐 **Security** • 📊 **Results**

</div>

---

## 🎯 Overview

**Clinical Scan Support System (CSSS)** is a full-stack AI healthcare platform designed to assist doctors in diagnosing lung diseases from **Chest X-ray and CT scan images** using deep learning.

The system enables:
- Secure doctor authentication  
- Medical image upload  
- AI-based disease prediction  
- Encrypted PDF medical report generation  
- Patient history management  
- Cloud-ready deployment  

This project demonstrates **real-world AI integration in healthcare**, following industry-level security, modular architecture, and deployment practices.

---

## ✨ Key Features

- 🧠 **AI-Powered Diagnosis** – Deep learning based lung disease detection  
- 🩺 **Doctor-Only Secure Login** – SHA-256 based authentication  
- 📤 **Medical Image Upload** – X-ray / CT scan support  
- 📊 **Confidence Score Display** – Transparent AI predictions  
- 📄 **Auto PDF Medical Reports** – Professionally generated reports  
- 🔐 **Encrypted Report Storage** – AES / Fernet encryption  
- 🗂️ **Patient History Database** – SQLite backed secure storage  
- 💬 **Medical AI Chatbot** – Doctor assistance module  
- 🚀 **Production-Ready** – Streamlit deployment, GPU-ready training  

---

## 🏥 Supported Lung Diseases

| Class | Description |
|------|------------|
| 🟢 Normal | Healthy lung scans |
| 🦠 Pneumonia | Bacterial / viral pneumonia |
| 🧪 COVID-19 | COVID-19 lung infection |
| 🫁 Lung Opacity / TB | Tuberculosis & lung opacity |

---

## 🏗️ System Architecture

<div align="center">
<img src="https://user-images.githubusercontent.com/placeholder/clinical_architecture.png" width="900"/>
</div>

### 🔧 Architecture Flow

1. Doctor logs in securely  
2. Uploads lung scan image  
3. Image preprocessing & normalization  
4. Deep learning inference (MobileNetV2)  
5. Disease classification with confidence score  
6. Encrypted PDF report generation  
7. Patient data stored securely  
8. Results delivered digitally  

---

## 🧩 Project Modules

| Module | Description |
|------|------------|
| `app.py` | Streamlit frontend & workflow |
| `predictor.py` | AI inference engine |
| `auth.py` | Doctor authentication |
| `encrypt.py` | AES / Fernet encryption |
| `pdf_generator.py` | Medical report generation |
| `notifier.py` | Email / alert system |
| `chatbot/` | AI medical assistant |
| `train_lung_model.py` | Model training pipeline |
| `split_lung_dataset.py` | Dataset preprocessing |

---

## 🧠 AI Model

### 🔬 Model Architecture
- Base Model: **MobileNetV2 (Transfer Learning)**
- Framework: TensorFlow + Keras  
- Input Size: 224 × 224 × 3  
- Optimizer: Adam  
- Loss Function: Categorical Crossentropy  
- Metrics: Accuracy, Precision, Recall  

### ⚡ Training Highlights
- GPU accelerated (CUDA)
- Data augmentation (rotation, flip, zoom)
- Large-scale dataset (200k+ images)
- Robust generalization performance

---

## 📊 Dataset Description

- **Source**: Kaggle – Chest X-Ray Lung Disease Dataset  
- **Size**: 200,000+ medical images  
- **Format**: JPG / PNG (grayscale)  

### Preprocessing
- Resize to 224×224  
- Pixel normalization  
- Data augmentation  
- Train / Validation / Test split  

---

## 📈 Evaluation & Results

✔️ High training & validation accuracy  
✔️ Stable convergence curves  
✔️ Confusion matrix analysis  
✔️ Misclassification inspection  
✔️ GPU vs CPU training speed comparison  

**Metrics Used**
- Accuracy  
- Precision  
- Recall  
- Confusion Matrix  

---

## 🔐 Security

- 🔒 Password hashing using SHA-256  
- 🔐 AES / Fernet encrypted PDF reports  
- 🗂️ Secure SQLite storage  
- 📜 Audit logging  

Ensures **patient data privacy** and **medical compliance readiness**.

---

## 🚀 Quick Start

### 📋 Prerequisites
- Python 3.8+
- TensorFlow
- Streamlit
- CUDA (optional)

### 🛠️ Installation

```bash
git clone https://github.com/yourusername/CLINICAL-SCAN-SUPPORT-SYSTEM.git
cd CLINICAL-SCAN-SUPPORT-SYSTEM
pip install -r requirements.txt
