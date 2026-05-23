# 🛡️ SentinelForge
### AI-Powered Cybersecurity & Threat Analysis Platform

SentinelForge is a professional full-stack cybersecurity platform developed using FastAPI, Machine Learning, and Python.

It integrates:
- Secure Authentication System
- Password Intelligence Analyzer
- Vulnerability Scanner
- AI Phishing Detection Engine

---

# 🚀 Features

## 🔐 Secure Authentication
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Access Control (RBAC)

## 🧠 Password Intelligence
- Password Strength Analysis
- Entropy Calculation
- Crack-Time Estimation
- Common Password Detection
- Security Recommendations

## 🛡️ Vulnerability Scanner
- Open Port Detection
- Service Identification
- Risk Classification
- Security Recommendations
- JSON Scan Reports

## 🤖 AI Phishing Detection
- Machine Learning Based Detection
- TF-IDF Vectorization
- Confidence Scoring
- Spam/Phishing Prediction
- 96%+ Accuracy

---

# 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| FastAPI | Backend Framework |
| SQLite | Database |
| SQLAlchemy | ORM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Scikit-learn | Machine Learning |
| Pandas | Data Processing |
| Python | Core Language |

---

# 📂 Project Structure

```bash
SentinelForge/
│
├── backend/
│   ├── app/
│   │   ├── modules/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── database.py
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── ml/
│   ├── data/
│   ├── requirements.txt
│   └── venv/
│
├── screenshots/
├── reports/
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/SentinelForge.git
```

## Navigate to Backend

```bash
cd backend
```

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\Activate.ps1
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Server

```bash
uvicorn app.main:app --reload
```

---

# 📡 API Documentation

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

# 📊 Model Performance

| Metric | Value |
|---|---|
| Accuracy | 96.68% |
| Precision | High |
| Recall | High |

---

# 🔥 Future Enhancements

- Real-Time Threat Monitoring
- Dashboard UI
- CVE Integration
- PDF Report Generation
- Threat Intelligence API
- Dark Mode Frontend

---

# 👩‍💻 Developer

Mary Roshina R

Cybersecurity & AI Enthusiast

---

# 📜 License

This project is licensed under the MIT License.