# Sentri AI Backend Documentation

# Overview

Sentri is a temporal ICU deterioration intelligence system designed to predict early sepsis and patient deterioration using rolling physiological trends instead of static threshold-based monitoring.

The system:
- receives rolling vital streams
- performs temporal feature engineering
- predicts deterioration risk using XGBoost
- returns explainable AI responses
- supports real-time ICU-style monitoring

---

# AI Model Details

## Model Used

XGBoost Classifier

## Why XGBoost?

XGBoost was selected because it performs extremely well on:
- structured medical tabular data
- temporal engineered features
- smaller datasets
- imbalanced healthcare datasets

Advantages:
- fast inference
- explainability support
- stable predictions
- handles imbalance well
- excellent for healthcare ML

---

# Model Architecture

The model does NOT directly detect infection.

Instead it detects:
- physiological deterioration trends
- worsening temporal behavior
- baseline deviations
- deterioration acceleration

Pipeline:

```text
Rolling ICU Vitals
↓
Temporal Window Extraction
↓
Feature Engineering
↓
Slope + Acceleration Analysis
↓
XGBoost Inference
↓
Continuous Risk Score
↓
Explainable AI Output
```

---

# Temporal Intelligence

The model uses:
- rolling windows
- slopes
- acceleration
- baseline comparisons

Instead of:
```text
single snapshot prediction
```

it performs:
```text
continuous deterioration analysis
```

---

# Input Features

## Heart Rate Features

- hr_mean
- hr_std
- hr_slope
- hr_acceleration
- hr_above_baseline

## SpO2 Features

- spo2_mean
- spo2_std
- spo2_slope
- spo2_acceleration

## Temperature Features

- temp_mean
- temp_slope
- temp_acceleration

## Respiratory Features

- resp_mean
- resp_slope
- resp_acceleration

## Blood Pressure Features

- sbp_mean
- map_mean
- sbp_above_baseline

## Patient History Features

- age
- age_60_plus
- diabetes
- smoker
- heart_disease
- kidney_disease
- baseline_sbp
- baseline_dbp
- baseline_hr
- bmi

---

# Model Training Improvements

## Challenge 1 — Missing Medical History

Problem:
The ICU dataset lacked medical history.

Solution:
Synthetic medical history generation:
- diabetes
- smoker
- BMI
- heart disease
- kidney disease
- baseline vitals

---

## Challenge 2 — Temporal Intelligence

Problem:
Initial model only analyzed static vitals.

Solution:
Rolling temporal windows were introduced.

The model learned:
- progression
- worsening trends
- deterioration momentum

---

## Challenge 3 — Class Imbalance

Problem:
Only ~2% sepsis cases existed.

Solution:
Used:
```python
scale_pos_weight
```

inside XGBoost to improve sepsis detection.

---

## Challenge 4 — Risk Spikes

Problem:
Predictions fluctuated unrealistically.

Solution:
Implemented exponential risk smoothing.

This produced:
- ICU-style monitoring
- smoother escalation
- stable risk progression

---

## Challenge 5 — No Deterioration Momentum

Problem:
Model only understood slopes.

Solution:
Acceleration features added:
- hr_acceleration
- spo2_acceleration
- temp_acceleration
- resp_acceleration

This improved:
- early escalation
- deterioration tracking
- sustained risk rise

---

# Backend Architecture

```text
Simulator / Hardware
↓
Node.js Backend
↓
Rolling Window Buffer
↓
FastAPI AI Backend
↓
Temporal Feature Engineering
↓
XGBoost Prediction
↓
Frontend Dashboard
```

---

# Why Feature Engineering Happens in FastAPI

Feature engineering was intentionally placed inside FastAPI because:
- centralized ML logic
- easier maintenance
- easier retraining
- prevents duplicate logic in Node.js
- easier deployment

Node.js only sends:
- raw rolling vitals
- patient history

FastAPI computes:
- slopes
- acceleration
- baseline deviation
- temporal features

---

# Backend Folder Structure

```text
sentri-ai-backend/
│
├── app/
│   ├── main.py
│   ├── predictor.py
│   ├── schemas.py
│   ├── feature_engineering.py
│   ├── model_loader.py
│   ├── explanations.py
│   └── utils.py
│
├── models/
│   ├── sentri_xgboost_model.pkl
│   └── feature_columns.pkl
│
├── requirements.txt
└── README.md
```

---

# Installing Dependencies

## Create Virtual Environment

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Mac/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Install Packages

```bash
pip install fastapi uvicorn pandas numpy scikit-learn xgboost joblib python-multipart
```
```bash
pip install requirement.txt 
```
---

# Starting the Server

Run:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

---

# Backend URLs

## Base URL

```text
http://localhost:8080
```

## Swagger Docs

```text
http://localhost:8080/docs
```

---

# API Endpoints

# 1. Health Check

## Endpoint

```http
GET /
```

## Response

```json
{
  "message": "Sentri AI Backend Running"
}
```

---

# 2. Prediction Endpoint

## Endpoint

```http
POST http://localhost:8080/predict
```

---

# Request Payload

```json
{
  "patient_id": "P1001",

  "history": {
    "age": 67,
    "diabetes": 1,
    "smoker": 0,
    "heart_disease": 1,
    "kidney_disease": 0,
    "baseline_hr": 80,
    "baseline_sbp": 120,
    "baseline_dbp": 80,
    "bmi": 29
  },

  "vitals_window": [

    {
      "hr": 80,
      "spo2": 98,
      "temp": 37,
      "resp": 18,
      "sbp": 120,
      "map": 85
    },

    {
      "hr": 84,
      "spo2": 97,
      "temp": 37.2,
      "resp": 19,
      "sbp": 118,
      "map": 83
    },

    {
      "hr": 88,
      "spo2": 96,
      "temp": 37.5,
      "resp": 20,
      "sbp": 116,
      "map": 82
    },

    {
      "hr": 92,
      "spo2": 95,
      "temp": 37.8,
      "resp": 22,
      "sbp": 114,
      "map": 80
    },

    {
      "hr": 96,
      "spo2": 94,
      "temp": 38,
      "resp": 24,
      "sbp": 110,
      "map": 78
    },

    {
      "hr": 102,
      "spo2": 93,
      "temp": 38.4,
      "resp": 26,
      "sbp": 108,
      "map": 76
    }
  ]
}
```

---

# Response Payload

```json
{
  "patient_id": "P1001",
  "risk_score": 54.4,
  "severity": "medium",
  "explanations": [
    "Heart rate rising steadily",
    "Oxygen saturation decreasing",
    "Temperature increasing",
    "Respiratory distress worsening"
  ]
}
```

---

# Risk Severity Logic

| Risk Score | Severity |
|---|---|
| 0–30 | Low |
| 30–60 | Medium |
| 60+ | High |

---

# Explainability System

The backend generates explainable medical reasoning.

Examples:
- Heart rate rising steadily
- Oxygen saturation decreasing
- Temperature increasing
- Respiratory distress worsening

This makes the AI:
- interpretable
- clinically understandable
- demo-friendly

---

# Postman Testing

## Method

```text
POST
```

## URL

```text
http://localhost:8080/predict
```

## Body Type

```text
raw → JSON
```

Paste the request payload and click:
```text
Send
```

---

# Current Capabilities

Completed:
- temporal monitoring
- rolling inference
- acceleration analysis
- baseline-aware prediction
- explainability generation
- FastAPI inference backend
- Postman testing
- real-time compatible architecture

---

# Future Improvements

Planned upgrades:
- SHAP explainability
- WebSocket streaming
- Redis buffers
- live dashboard analytics
- persistent alerts
- Docker deployment
- Kubernetes scaling
- JWT authentication
- multi-patient management

---

# Final System Goal

Sentri aims to:
- reduce alert fatigue
- predict deterioration earlier
- provide explainable ICU intelligence
- improve real-time patient monitoring
- support proactive clinical intervention
