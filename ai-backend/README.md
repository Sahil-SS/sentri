# Sentri — AI Model WorkFlow 

## Overview

Sentri is an AI-powered ICU deterioration intelligence system designed to predict early sepsis risk using temporal physiological trends from patient vital signs.

Unlike traditional static prediction systems that rely on single-time measurements, Sentri analyzes:

- temporal behavior of vital signs
- deterioration trends
- worsening physiological patterns
- acceleration of patient decline
- deviation from baseline patient health

The system continuously evaluates ICU patient data and generates dynamic sepsis risk scores for real-time monitoring and early intervention.

---

# Final System Goal

Sentri aims to:

- reduce alert fatigue
- predict deterioration earlier
- provide explainable ICU intelligence
- improve real-time patient monitoring
- support proactive clinical intervention

---

# Complete System Architecture

```text
Simulator / Hardware
        ↓
Node.js Backend
        ↓
MongoDB
(continuous vitals storage)
        ↓
Node.js fetches latest 6 vitals
        ↓
FastAPI AI Backend
        ↓
Temporal Feature Engineering
        ↓
XGBoost Prediction
        ↓
Explainability Engine
        ↓
Frontend Dashboard
```

---

# High-Level AI Workflow

```text
Raw ICU Dataset
       ↓
Data Cleaning & Missing Value Handling
       ↓
Chronological Patient Sorting
       ↓
Patient Historical Data Generation
       ↓
Temporal Feature Engineering
       ↓
Sliding Window Processing
       ↓
XGBoost Machine Learning Model
       ↓
Risk Probability Prediction
       ↓
Risk Smoothing
       ↓
Severity Classification
       ↓
Visualization & Monitoring
       ↓
Model Export & Deployment
```

---

# AI Model Details

## Model Used

- XGBoost Classifier

---

# Why XGBoost?

XGBoost was selected because it performs extremely well on:

- structured medical tabular data
- temporal engineered features
- smaller datasets
- imbalanced healthcare datasets

---

# Advantages of XGBoost

- fast inference
- explainability support
- stable predictions
- handles imbalance well
- excellent for healthcare machine learning

---

# Model Architecture

The model does NOT directly detect infection.

Instead, it detects:

- physiological deterioration trends
- worsening temporal behavior
- baseline deviations
- deterioration acceleration

---

# AI Prediction Pipeline

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

Instead of:
- single snapshot prediction

the model performs:
- continuous deterioration analysis

The system uses:
- rolling windows
- slopes
- acceleration
- baseline comparisons

---

# Working Flow

---

# 1. Dataset Loading

The ICU dataset is loaded into a pandas DataFrame.

```python
df = pd.read_csv("Dataset.csv")
```

---

# 2. Data Cleaning

Missing values are handled using:

- Forward Fill (`ffill`)
- Backward Fill (`bfill`)
- Null Row Removal

```python
df.fillna(method='ffill')
df.fillna(method='bfill')
```

---

# 3. Chronological Sorting

Patient records are sorted by:

- `Patient_ID`
- `Hour`

```python
df.sort_values(by=['Patient_ID', 'Hour'])
```

This preserves temporal continuity.

---

# 4. Synthetic Historical Data Generation

The notebook generates additional patient baseline features:

- diabetes
- smoker
- BMI
- baseline vitals
- heart disease
- kidney disease

---

# 5. Sliding Window Analysis

The system uses:

```python
window_size = 6
```

This means:
- the previous 6 hours of patient vitals
- are used to predict future deterioration risk.

---

# Sliding Window Concept

```text
Hour 1 → Hour 6 → Predict Risk
Hour 2 → Hour 7 → Predict Risk
Hour 3 → Hour 8 → Predict Risk
```

---

# 6. Temporal Feature Engineering

Feature engineering is the core intelligence layer.

The system extracts:

| Feature Type | Purpose |
|---|---|
| Mean | Average condition |
| Standard Deviation | Variability |
| Slope | Trend direction |
| Acceleration | Deterioration speed |
| Baseline Delta | Deviation from normal |

---

# Input Features

---

# Heart Rate Features

- hr_mean
- hr_std
- hr_slope
- hr_acceleration
- hr_above_baseline

---

# SpO2 Features

- spo2_mean
- spo2_std
- spo2_slope
- spo2_acceleration

---

# Temperature Features

- temp_mean
- temp_slope
- temp_acceleration

---

# Respiratory Features

- resp_mean
- resp_slope
- resp_acceleration

---

# Blood Pressure Features

- sbp_mean
- map_mean
- sbp_above_baseline

---

# Patient History Features

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

# 7. Slope Analysis

The notebook calculates slopes to identify worsening physiological trends.

Example:

```text
HR: 80 → 84 → 88 → 92
```

Positive slope:
- indicates continuous deterioration.

---

# 8. Acceleration Analysis

Acceleration measures:
- how quickly deterioration itself is increasing.

Added features:

- hr_acceleration
- spo2_acceleration
- temp_acceleration
- resp_acceleration

This improves:
- early escalation detection
- deterioration momentum analysis

---

# 9. Model Training

The system trains an:

```python
XGBClassifier()
```

using:
- engineered temporal features
- patient history
- rolling windows

---

# 10. Handling Class Imbalance

## Problem

Only ~2% sepsis cases existed.

## Solution

Used:

```python
scale_pos_weight
```

inside XGBoost to improve sepsis sensitivity.

---

# 11. Risk Probability Prediction

Instead of binary outputs:

```text
0 = No Sepsis
1 = Sepsis
```

the model generates continuous risk probabilities.

Example:

```text
0.12
0.35
0.76
0.91
```

---

# 12. Risk Smoothing

## Problem

Predictions fluctuated unrealistically.

## Solution

Implemented:
- exponential moving average smoothing

Benefits:
- smoother escalation
- ICU-style monitoring
- stable risk progression

---

# 13. Severity Classification

| Risk Score | Severity |
|---|---|
| 0–30 | Low |
| 30–60 | Medium |
| 60+ | High |

---

# 14. Explainability System

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

# Backend Architecture

---

# MongoDB Temporal Storage

MongoDB acts as the temporal storage layer for the entire system.

Incoming streaming vitals are continuously stored inside MongoDB.

Node.js fetches:
- latest 6 readings
- sorted by timestamp
- reversed into oldest → newest order

before sending them to FastAPI.

---

# Why MongoDB?

This architecture:

- preserves temporal continuity
- supports historical analytics
- enables replay visualization
- supports scalable multi-patient inference
- avoids in-memory backend state management

---

# Why Feature Engineering Happens in FastAPI

## Node.js Responsibilities

- store incoming streaming vitals
- fetch latest 6 vitals
- reverse temporal order
- fetch patient medical history
- send rolling windows to FastAPI

---

## FastAPI Responsibilities

- temporal feature engineering
- slope analysis
- acceleration analysis
- baseline deviation analysis
- XGBoost inference
- explainability generation

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

# Installation Guide

---

# Create Virtual Environment

## Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

## Mac/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

# Install Dependencies

```bash
pip install fastapi uvicorn pandas numpy scikit-learn xgboost joblib python-multipart
```

OR

```bash
pip install -r requirements.txt
```

---

# Starting the Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

---

# Backend URLs

---

# Base URL

```text
http://localhost:8080
```

---

# Swagger Documentation

```text
http://localhost:8080/docs
```

---

# API Endpoints

---

# 1. Health Check Endpoint

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
POST /predict
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
  "window_size": 6,
  "explanations": [
    "Heart rate rising steadily",
    "Oxygen saturation decreasing",
    "Temperature increasing",
    "Respiratory distress worsening"
  ]
}
```

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
- Send

---

# Current Capabilities

Completed Features:

- temporal monitoring
- rolling window inference
- MongoDB temporal storage
- acceleration analysis
- baseline-aware prediction
- explainability generation
- FastAPI inference backend
- Postman testing
- real-time streaming architecture
- Node.js + FastAPI integration design

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

# Final Workflow Summary

```text
Patient Vitals
      ↓
Temporal Analysis
      ↓
Feature Engineering
      ↓
Trend & Acceleration Detection
      ↓
XGBoost Prediction
      ↓
Risk Probability
      ↓
Risk Smoothing
      ↓
Severity Classification
      ↓
Explainable AI Output
      ↓
Real-Time ICU Monitoring
```

---

# Conclusion

Sentri combines:

- temporal physiological analysis
- machine learning
- deterioration intelligence
- explainable AI
- real-time monitoring
- scalable backend architecture

to build an advanced ICU deterioration prediction system capable of early sepsis detection and continuous patient risk monitoring.

The project demonstrates how AI can move beyond static classification and instead model dynamic physiological deterioration behavior over time.