# Sentri AI Backend

## Overview

Sentri is an AI-powered ICU deterioration and sepsis risk monitoring system.

The architecture consists of:

- Node.js + Express backend
- FastAPI AI inference backend
- MongoDB database
- XGBoost temporal deterioration prediction model
- Groq-powered LLM medical history parsing
- Rolling-window vital monitoring pipeline

The system continuously monitors incoming patient vitals and predicts deterioration risk using temporal physiological trends.

---

# System Architecture

```text
Patient Registration
        ↓
Medical History Input (Text / PDF)
        ↓
Groq LLM Parsing
        ↓
Structured Patient Profile
        ↓
MongoDB Storage
        ↓
Rolling Vitals Collection
        ↓
Temporal Feature Engineering
        ↓
FastAPI AI Backend
        ↓
XGBoost Prediction
        ↓
Explainability Layer
        ↓
Alerts + Dashboard
```

---

# Backend Folder Structure

## Node Backend

```text
node_backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── patientController.js
│   │   ├── vitalController.js
│   │   ├── alertController.js
│   │   └── dashboardController.js
│   │
│   ├── models/
│   │   ├── Patient.js
│   │   ├── Vitals.js
│   │   ├── Prediction.js
│   │   └── Alert.js
│   │
│   ├── routes/
│   │   ├── patientRoutes.js
│   │   ├── vitalRoutes.js
│   │   ├── alertRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── services/
│   │   ├── groqService.js
│   │   ├── pdfService.js
│   │   └── aiService.js
│   │
│   ├── utils/
│   │   ├── prompts.js
│   │   └── historySchema.js
│   │
│   └── uploads/
│
├── server.js
├── package.json
└── .env
```

---

## FastAPI Backend

```text
ai-backend/
│
├── app/
│   ├── explanations.py
│   ├── feature_engineering.py
│   ├── main.py
│   ├── model_loader.py
│   ├── predictor.py
│   ├── schemas.py
│   └── utils.py
│
├── models/
│   ├── sentri_xgboost_model.pkl
│   └── feature_columns.pkl
│
├── requirements.txt
├── Procfile
└── runtime.txt
```

---

# Core System Flow

## 1. Patient Registration

Patients can be registered using:

- Raw medical history text
- PDF medical history upload

Endpoint:

```http
POST /api/patients/register
```

The backend:

1. Extracts PDF text (if PDF uploaded)
2. Sends medical history to Groq LLM
3. Converts unstructured history into structured JSON
4. Stores patient profile in MongoDB

---

## 2. Rolling Vitals Monitoring

Vitals are sent continuously from the simulation dashboard.

Endpoint:

```http
POST /api/vitals
```

Each new vital is stored in MongoDB.

The backend fetches the latest 6 vitals:

```text
V1 V2 V3 V4 V5 V6
```

After the 7th vital:

```text
V2 V3 V4 V5 V6 V7
```

The rolling window continuously updates.

---

## 3. AI Prediction Pipeline

The Node backend sends:

- patient baseline history
- latest 6 vitals

to the FastAPI AI backend.

The AI backend:

1. Generates temporal features
2. Computes slopes and accelerations
3. Runs XGBoost inference
4. Generates explanations
5. Returns deterioration probability

---

# Feature Engineering

The model uses:

## Temporal Features

- hr_mean
- hr_std
- hr_slope
- hr_acceleration

- spo2_mean
- spo2_std
- spo2_slope
- spo2_acceleration

- temp_mean
- temp_slope
- temp_acceleration

- resp_mean
- resp_slope
- resp_acceleration

- sbp_mean
- map_mean

---

## Baseline Features

- hr_above_baseline
- sbp_above_baseline

---

## Patient History Features

- age
- diabetes
- smoker
- heart_disease
- kidney_disease
- baseline_sbp
- baseline_dbp
- baseline_hr
- bmi

---

# Important Model Note

The trained model uses:

```text
Class 0 = deterioration/high risk
Class 1 = stable/low risk
```

Therefore:

```python
probability = probas[0] * 100
```

is the correct deterioration risk probability.

---

# Alert Logic

## Severity Thresholds

```text
0–34   → LOW
35–49  → MEDIUM
50+    → HIGH
```

---

# API Endpoints

---

## Register Patient

### Route

```http
POST /api/patients/register
```

### Supports

- text medical history
- PDF upload

### Form Data

| Key | Type |
|-----|------|
| patient_id | Text |
| history_text | Text |
| file | File |

---

## Get All Patients

```http
GET /api/patients
```

---

## Get Single Patient

```http
GET /api/patients/:patientId
```

---

## Send Vitals

```http
POST /api/vitals
```

### Payload

```json
{
  "patient_id": "P1001",
  "heart_rate": 118,
  "spo2": 88,
  "temperature": 39.2,
  "respiratory_rate": 31,
  "systolic_bp": 102,
  "mean_arterial_pressure": 69
}
```

---

## Dashboard Endpoint

```http
GET /api/dashboard/:patientId
```

Returns:

- patient details
- latest vitals
- latest prediction
- active alerts
- historical vitals
- historical predictions

---

# Environment Variables

## Node Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key

AI_BACKEND_URL=http://localhost:8080/predict
```

---

## FastAPI Backend `.env`

Optional depending on deployment.

---

# Local Setup Guide

---

# 1. Clone Repository

```bash
git clone <repo-url>
```

---

# 2. Install Node Backend

```bash
cd node_backend

npm install
```

---

# 3. Install FastAPI Backend

```bash
cd ai-backend

python -m venv venv
```

Activate venv:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

Install requirements:

```bash
pip install -r requirements.txt
```

---

# 4. Configure Environment Variables

Create:

```text
node_backend/.env
```

Add:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

GROQ_API_KEY=your_groq_api_key

AI_BACKEND_URL=http://localhost:8080/predict
```

---

# 5. Run FastAPI Backend

```bash
cd ai-backend

uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

---

# 6. Run Node Backend

```bash
cd node_backend

npm run dev
```

---

# Deployment

## Recommended

### Node Backend

- Railway
- Render

### FastAPI Backend

- Railway

### Database

- MongoDB Atlas

---

# MongoDB Atlas Setup

1. Create cluster
2. Create database user
3. Add IP whitelist:

```text
0.0.0.0/0
```

4. Copy connection string

---

# Required Packages

## Node Backend

```bash
npm install express mongoose multer axios dotenv groq-sdk pdf-parse cors
```

---

## FastAPI Backend

```bash
pip install fastapi uvicorn pandas numpy scikit-learn xgboost joblib
```

---

# Current Capabilities

- LLM medical history parsing
- PDF ingestion
- Rolling temporal monitoring
- XGBoost deterioration prediction
- Explainability generation
- Alert generation
- Dashboard aggregation
- Historical tracking
- Baseline-aware monitoring

---

# Future Improvements

- OCR for scanned PDFs
- WebSocket live monitoring
- Real-time charts
- ICU simulation dashboard
- Multi-patient monitoring
- Alert acknowledgement system
- Authentication
- RBAC
- SHAP explainability
- Redis queues
- Kafka streaming

---

# Important Notes

- The first prediction is generated after 6 vitals.
- Every new vital after that triggers a new rolling-window prediction.
- The system continuously adapts to patient deterioration and recovery trends.

---

# Example Monitoring Behavior

```text
Vitals 1–5
→ stored only

Vital 6
→ first prediction

Vital 7
→ uses V2–V7

Vital 8
→ uses V3–V8
```

This creates continuous temporal ICU monitoring.
