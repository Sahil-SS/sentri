# Sentri Node Backend API Documentation

# Overview

Sentri is a real-time ICU deterioration intelligence system designed to:
- ingest streaming patient vitals
- store temporal ICU data
- orchestrate FastAPI AI inference
- generate sepsis deterioration risk scores
- persist predictions and alerts
- power real-time ICU dashboards

Base URL:

```text
http://localhost:5000
```

---

# Backend Architecture

```text
Simulator Dashboard
↓
Node.js Backend
↓
MongoDB
↓
Rolling Window Retrieval
↓
FastAPI AI Backend
↓
XGBoost Inference
↓
Predictions + Alerts
↓
Frontend Dashboard
```

---

# Available Endpoints

| Category | Method | Endpoint |
|---|---|---|
| Patients | POST | /api/patients/register |
| Patients | GET | /api/patients |
| Patients | GET | /api/patients/:patientId |
| Vitals | POST | /api/vitals |
| Dashboard | GET | /api/dashboard/:patientId |
| Predictions | GET | /api/predictions/:patientId |
| Alerts | GET | /api/alerts/:patientId |
| Alerts | PATCH | /api/alerts/:alertId/acknowledge |

---

# 1. Register Patient

## Endpoint

```http
POST /api/patients/register
```

## Description

Registers a new patient and stores medical history.

Currently:
- Gemini parsing is mocked during development
- Patient history is inserted into MongoDB

---

## Request Body

```json
{
  "patient_id": "P1001",
  "history_text": "67 year old male with diabetes and hypertension"
}
```

---

## Success Response

```json
{
  "success": true,
  "patient": {
    "_id": "69fe123abc",
    "patient_id": "P1001",
    "age": 67,
    "age_60_plus": 1,
    "diabetes": 1,
    "smoker": 0,
    "heart_disease": 1,
    "kidney_disease": 0,
    "baseline_sbp": 150,
    "baseline_dbp": 95,
    "baseline_hr": 82,
    "bmi": 32
  }
}
```

---

# 2. Get All Patients

## Endpoint

```http
GET /api/patients
```

## Description

Returns all patients stored in MongoDB.

Used for:
- simulator dashboard dropdown
- ICU patient selection sidebar

---

## Success Response

```json
{
  "success": true,
  "patients": [
    {
      "_id": "69fe123abc",
      "patient_id": "P1001",
      "age": 67
    }
  ]
}
```

---

# 3. Get Single Patient

## Endpoint

```http
GET /api/patients/:patientId
```

Example:

```http
GET /api/patients/P1001
```

---

## Description

Returns a single patient's stored history.

---

## Success Response

```json
{
  "success": true,
  "patient": {
    "_id": "69fe123abc",
    "patient_id": "P1001",
    "age": 67,
    "diabetes": 1,
    "heart_disease": 1,
    "baseline_hr": 82
  }
}
```

---

# 4. Add Vitals

## Endpoint

```http
POST /api/vitals
```

---

## Description

Stores incoming vitals.

Backend Flow:

```text
store vitals
↓
fetch latest 6 readings
↓
reverse oldest → newest
↓
send to FastAPI
↓
receive prediction
↓
store prediction
↓
generate alerts
```

AI inference triggers only after:
- 6 temporal readings exist

---

## Request Body

```json
{
  "patient_id": "P1001",
  "heart_rate": 102,
  "spo2": 93,
  "temperature": 38.4,
  "respiratory_rate": 26,
  "systolic_bp": 108,
  "mean_arterial_pressure": 76
}
```

---

## Response Before 6 Readings

```json
{
  "success": true,
  "message": "Vitals stored. Need 1 more readings for AI prediction."
}
```

---

## Response After 6 Readings

```json
{
  "success": true,
  "vitals": {
    "patient_id": "P1001",
    "heart_rate": 102,
    "spo2": 93
  },
  "prediction": {
    "patient_id": "P1001",
    "risk_score": 63.02,
    "severity": "high",
    "explanation": [
      "Heart rate rising steadily",
      "Oxygen saturation decreasing",
      "Temperature increasing"
    ]
  }
}
```

---

# 5. Dashboard Endpoint

## Endpoint

```http
GET /api/dashboard/:patientId
```

Example:

```http
GET /api/dashboard/P1001
```

---

## Description

Primary ICU monitoring endpoint.

Returns:
- patient overview
- latest vitals
- latest prediction
- active alerts
- historical vitals
- historical predictions

This powers the frontend ICU dashboard.

---

## Success Response

```json
{
  "success": true,

  "patient": {
    "patient_id": "P1001",
    "age": 67
  },

  "latestVitals": {
    "heart_rate": 102,
    "spo2": 93,
    "temperature": 38.4
  },

  "latestPrediction": {
    "risk_score": 63.02,
    "severity": "high"
  },

  "activeAlerts": [
    {
      "severity": "high",
      "message": "High sepsis deterioration risk detected"
    }
  ],

  "historicalVitals": [],

  "historicalPredictions": []
}
```

---

# 6. Get Prediction History

## Endpoint

```http
GET /api/predictions/:patientId
```

Example:

```http
GET /api/predictions/P1001
```

---

## Description

Returns all prediction history for a patient.

Used for:
- deterioration timeline
- risk trend graphs
- historical analytics

---

## Success Response

```json
{
  "success": true,
  "predictions": [
    {
      "risk_score": 63.02,
      "severity": "high",
      "timestamp": "2026-05-08T18:17:46.620Z"
    }
  ]
}
```

---

# 7. Get Alerts

## Endpoint

```http
GET /api/alerts/:patientId
```

Example:

```http
GET /api/alerts/P1001
```

---

## Description

Returns all alerts for a patient.

Used for:
- alert modal
- notification center
- ICU warning display

---

## Success Response

```json
{
  "success": true,
  "alerts": [
    {
      "_id": "69fealert123",
      "severity": "high",
      "message": "High sepsis deterioration risk detected",
      "acknowledged": false
    }
  ]
}
```

---

# 8. Acknowledge Alert

## Endpoint

```http
PATCH /api/alerts/:alertId/acknowledge
```

Example:

```http
PATCH /api/alerts/69fealert123/acknowledge
```

---

## Description

Marks an alert as acknowledged.

Used when clinician dismisses or confirms an alert.

---

## Success Response

```json
{
  "success": true,
  "alert": {
    "_id": "69fealert123",
    "acknowledged": true
  }
}
```

---

# MongoDB Collections

The backend currently uses:

```text
patients
vitals
predictions
alerts
```

---

# Temporal Intelligence Logic

The backend uses rolling windows of:
- latest 6 vitals

Critical query:

```js
const latestVitals =
  await Vitals.find({
    patient_id
  })
    .sort({
      timestamp: -1
    })
    .limit(6);

const vitalsWindow =
  latestVitals.reverse();
```

This reversal is critical because FastAPI expects:

```text
oldest → newest
```

temporal ordering.

---

# FastAPI Integration

Node.js communicates with:

```text
POST http://localhost:8080/predict
```

Responsibilities:

Node.js:
- vitals storage
- rolling window retrieval
- orchestration
- prediction persistence
- alert generation

FastAPI:
- feature engineering
- slope analysis
- acceleration analysis
- XGBoost inference
- explainability generation

---

# Current Backend Capabilities

Completed:
- patient registration
- temporal vitals ingestion
- rolling window retrieval
- FastAPI orchestration
- XGBoost prediction
- explainability generation
- prediction persistence
- alert generation
- dashboard aggregation APIs
- historical analytics APIs

---
