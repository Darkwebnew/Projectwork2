<div align="center">

# 🧬 CLINICAL SCAN SUPPORT SYSTEM  
### AI-Powered Medical Image Diagnosis & Clinical Decision Support Platform

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://www.python.org/)
[![AI](https://img.shields.io/badge/AI-TensorFlow%20%7C%20Keras-orange.svg)](https://www.tensorflow.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-Ready-brightgreen.svg)](https://streamlit.io/)

**Secure, intelligent, and automated lung disease diagnosis from Chest X-ray and CT scan images using deep learning.**

[🚀 Quick Start](#-installation) • [🏗️ Architecture](#-system-architecture) • [🧠 AI Model](#-ai-model) • [🔐 Security](#-security) • [📊 Results](#-evaluation--results)

</div>

---

## 🌟 Project Overview

**Clinical Scan Support System (CSSS)** is a full-stack AI healthcare platform that assists doctors in diagnosing lung diseases. It integrates AI-based image analysis, secure doctor login, encrypted PDF report generation, patient history management, and cloud-ready deployment.

### 🎯 Why CSSS?

- Traditional methods are slow and error-prone. CSSS provides **automated, reliable, and secure AI-driven diagnosis**.  
- Modular architecture allows **scalable hospital deployment**.  
- Combines **AI + Security + Healthcare compliance**, ideal for **academic, research, and real-world use**.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🧠 AI-Powered Diagnosis
Deep learning models (MobileNetV2) detect lung diseases in X-ray and CT scans.

### 🩺 Doctor-Only Secure Login
SHA-256 based authentication for doctors ensures patient data privacy.

### 📤 Medical Image Upload
Supports X-ray and CT images with preprocessing and normalization.

### 📊 Confidence Score Display
Transparent AI predictions with probability metrics.

</td>
<td width="50%">

### 📄 Auto PDF Medical Reports
Professional reports are generated automatically for each patient.

### 🔐 Encrypted Report Storage
AES / Fernet encryption ensures secure storage and compliance.

### 🗂️ Patient History Database
Secure SQLite database stores past patient scans and reports.

### 💬 Medical AI Chatbot
Doctor assistance module for queries and clinical guidance.

### 🚀 Production-Ready
Streamlit deployment with GPU-ready training.

</td>
</tr>
</table>

---

## 🏥 Supported Lung Diseases

| Class | Description |
|-------|------------|
| 🟢 Normal | Healthy lung scans |
| 🦠 Pneumonia | Bacterial / viral pneumonia |
| 🧪 COVID-19 | COVID-19 lung infection |
| 🫁 Lung Opacity / TB | Tuberculosis & lung opacity |

---

## 🏗️ System Architecture

<div align="center">
<img src="img/architecture_diagram.png" width="900"/>
</div>

### 🔧 Architecture Flow

1. Doctor logs in securely  
2. Uploads lung scan image  
3. Image preprocessing & normalization  
4. Deep learning inference (**MobileNetV2**)  
5. Disease classification with confidence score  
6. Encrypted PDF report generation  
7. Patient data stored securely  
8. Results delivered digitally  

---

## 🧩 Project Modules

| Module | Description |
|--------|------------|
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

- 🔒 SHA-256 password hashing  
- 🔐 AES / Fernet encrypted PDF reports  
- 🗂️ Secure SQLite storage  
- 📜 Audit logging  

Ensures **patient data privacy** and **medical compliance readiness**.

---

## 🚀 Installation

### 📋 Prerequisites

```bash
✓ Python 3.8+
✓ TensorFlow
✓ Streamlit
✓ CUDA (optional)
✓ Git
```

## 🔧 Setup Steps

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/CLINICAL-SCAN-SUPPORT-SYSTEM.git
cd CLINICAL-SCAN-SUPPORT-SYSTEM
```

## 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Run Application

```bash
streamlit run app.py
```

### 4️⃣ Train AI Model (Optional)

```bash
python train_lung_model.py
```

### Trained model saved as:

```bash
lung_classification_model.h5
```

---

## 🌍 Deployment

- Local deployment using Streamlit
- GPU-based training environment
- Streamlit Cloud / AWS ready
- Modular and cloud-scalable architecture

---

## 🔮 Future Scope

- Hospital dashboard analytics
- Android mobile application
- Multi-organ disease detection
- Blockchain medical audit trail
- IoT medical device integration
- Real-time hospital system APIs

---

## 🎓 Academic Relevance

- Final Year Engineering Project
- IEEE research-paper-ready architecture
- Healthcare AI use case
- Demonstrates AI + Security + Deployment


---

## 👨‍⚕️ Authors

| Name                     | Role         | GitHub                                                                       |
| ------------------------ | ------------ | ---------------------------------------------------------------------------- |
| **Sriram V**             | Project Lead | [https://github.com/darkwebnew](https://github.com/darkwebnew)               |
| **Swedha V**             | Mentor       | [https://github.com/swedha333](https://github.com/swedha333)                 |
| **Selvakumar R**         | Co-Mentor    | [https://github.com/selvasachein](https://github.com/selvasachein)           |
| **Surothaaman R**        | Contributor  | [https://github.com/surothaaman](https://github.com/surothaaman)             |
| **Andrew Varhese V S** | Contributor  | [https://github.com/Andrewvarghese653](https://github.com/Andrewvarghese653) |
| **Praveen C K**           | Contributor  | [https://github.com/praveenck23009864](https://github.com/praveenck23009864) |

---

## 📜 License

This project is licensed under the MIT License - see [LICENSE](https://github.com/Darkwebnew/Projectwork2/blob/main/LICENSE.txt) for details.

---

## 📸 Screenshots

| Doctor Dashboard | Admin Dashboard | Patient Dashboard |
| ---------------- | --------------- | ---------------- |
| <img src="img/dashboard_doctor.png" width="400"/> | <img src="img/dashboard_admin.png" width="400"/> | <img src="img/dashboard_patient.png" width="400"/> |

| Chatbot Panel | AI Pipeline | Workflow Diagram |
| ------------- | ----------- | ---------------- |
| <img src="img/dashboard_chatbot.png" width="400"/> | <img src="img/ai_pipeline.png" width="400"/> | <img src="img/workflow_diagram.png" width="400"/> |

| System Architecture | Security Diagram | Confusion & Training |
| ------------------ | ---------------- | ------------------ |
| <img src="img/architecture_diagram.png" width="400"/> | <img src="img/security_diagram.png" width="400"/> | <img src="img/confusion_matrix.png" width="400"/> <br> <img src="img/training_curve.png" width="400"/> |

---

## 🙏 Acknowledgments

### 🎓 Academic Guidance: Swedha V, Saveetha Engineering College
### 🔬 Research References: Kaggle Chest X-ray datasets, MobileNetV2, TensorFlow/Keras tutorials
### 🛠️ Tools & Libraries: TensorFlow, Keras, Streamlit, SQLite, AES / Fernet

---

## 📞 Contact

Project Maintainer: [Sriram V](mailto:sriramnvks@gmail.com)

GitHub: [https://github.com/darkwebnew](https://github.com/darkwebnew)
