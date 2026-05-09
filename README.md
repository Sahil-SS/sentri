# SENTRI — Autonomous ICU Deterioration Monitoring & Escalation Platform

Sentri is an advanced AI-powered ICU deterioration intelligence platform designed to simulate realistic hospital monitoring, escalation, and clinical intelligence workflows.

Unlike traditional healthcare AI systems that only perform static predictions, Sentri combines:

- Temporal ICU monitoring
- Rolling-window AI inference
- Explainable machine learning
- LLM-generated clinical summaries
- Automated alert escalation
- Workflow orchestration using n8n
- Real-time dashboard visualization

The platform continuously monitors ICU patient vitals, predicts deterioration risk, generates explainable insights, and orchestrates automated escalation pipelines similar to real hospital ICU systems.

---

# Core Vision

Sentri is **NOT** just:

> "an ML prediction project"

Sentri **IS**:

> "an autonomous ICU deterioration monitoring and escalation platform with AI-powered clinical intelligence and workflow orchestration."

---

# System Architecture

```text
Patient Registration
↓
Medical History Input (Text or PDF)
↓
Groq LLM Parsing
↓
Structured Patient Profile
↓
MongoDB Storage
↓
Continuous Vitals Collection
↓
Rolling Window Temporal Analysis
↓
FastAPI AI Inference
↓
XGBoost Prediction
↓
Explainability Engine
↓
AI Nurse Summary
↓
Intervention Recommendation Engine
↓
Alert Generation
↓
n8n Escalation Workflow
↓
Telegram + Email Notifications
↓
Incident Report Generation
↓
Dashboard Visualization
```

---

# Repository Structure

```text
sentri/
│
├──ai-backend/
├── node_backend/
├── simulation_dashboard/
├── main_dashboard/
└── README.md
```

---

# Tech Stack

## Frontend

- Next.js
- React.js
- Tailwind CSS
- Recharts / Chart.js

## Backend

- Node.js
- Express.js
- FastAPI
- Python

## AI / ML

- XGBoost
- Scikit-learn
- Pandas
- NumPy
- Groq LLM API

## Database

- MongoDB Atlas

## Workflow Automation

- n8n
- Telegram API
- Gmail Integration

## Deployment

- Railway
- Render
- Vercel
- MongoDB Atlas
- n8n Cloud

---

# Key Features

## Real-Time ICU Monitoring

Sentri continuously monitors:

- heart rate
- oxygen saturation
- respiratory rate
- blood pressure
- temperature

using rolling temporal windows.

---

## Rolling Window Temporal Analysis

The system uses the latest 6 vitals for every prediction.

Example:

```text
V1 V2 V3 V4 V5 V6
→ Prediction 1

V2 V3 V4 V5 V6 V7
→ Prediction 2

V3 V4 V5 V6 V7 V8
→ Prediction 3
```

This creates realistic ICU-style continuous monitoring.

---

# AI Backend Workflow

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
Risk Score Prediction
        ↓
Explainability Engine
        ↓
AI Nurse Summary
        ↓
Dashboard + Escalation
```

---

# Temporal Feature Engineering

Sentri extracts temporal deterioration intelligence using:

| Feature Type | Purpose |
|---|---|
| Mean | Average patient condition |
| Standard Deviation | Physiological variability |
| Slope | Deterioration direction |
| Acceleration | Deterioration speed |
| Baseline Delta | Deviation from baseline |

---

# Engineered Features

## Heart Rate

- hr_mean
- hr_std
- hr_slope
- hr_acceleration
- hr_above_baseline

## SpO2

- spo2_mean
- spo2_std
- spo2_slope
- spo2_acceleration

## Temperature

- temp_mean
- temp_slope
- temp_acceleration

## Respiration

- resp_mean
- resp_slope
- resp_acceleration

## Blood Pressure

- sbp_mean
- map_mean
- sbp_above_baseline

---

# Model Details

## ML Model

Sentri uses:

- XGBoost Classifier
- Temporal deterioration analysis
- Rolling window inference
- Continuous risk scoring

---

# Important Prediction Logic

```python
probability = probas[0] * 100
```

### Class Mapping

| Class | Meaning |
|---|---|
| 0 | Deterioration / High Risk |
| 1 | Stable / Low Risk |

---

# Risk Thresholds

| Risk Score | Severity |
|---|---|
| 0–34 | LOW |
| 35–49 | MEDIUM |
| 50+ | HIGH |

---

# Explainability Engine

The explainability engine generates interpretable clinical reasoning.

Examples:

```text
Heart rate rising steadily
Oxygen saturation decreasing
Temperature increasing
Respiratory distress worsening
```

### Example Logic

```python
if hr_slope > 2:
    "Heart rate rising steadily"

if spo2_slope < -0.5:
    "Oxygen saturation decreasing"

if temp_slope > 0.2:
    "Temperature increasing"
```

---

# AI Nurse Summary System

Sentri includes a Groq-powered AI Nurse Summary engine.

The system converts:

- latest vitals
- prediction scores
- deterioration trends
- explainability results

into concise ICU clinical summaries.

---

# Example AI Nurse Summary

```text
Patient condition appears to be worsening over the last 20 minutes with increasing heart rate, declining oxygen saturation, and elevated respiratory rate. Current deterioration risk is high. Immediate clinical evaluation is recommended.
```

---

# Intervention Recommendation Engine

Sentri generates monitoring-oriented recommendations using rule-based logic.

> NOTE:
> These are educational and demo-oriented suggestions.
> They are NOT medical advice.

---

# Example Intervention Rules

```text
if spo2 < 92:
→ Review oxygen support

if respiratory_rate > 24:
→ Assess respiratory distress

if temperature > 38.5:
→ Evaluate possible infection
```

---

# Example Intervention Output

```json
[
  "Increase monitoring frequency",
  "Review oxygen support",
  "Assess respiratory distress"
]
```

---

# n8n ICU Escalation Workflow

One of the most important features of Sentri is automated ICU escalation orchestration using n8n.

---

# n8n Workflow Architecture

```text
Patient deterioration detected
↓
Node backend generates HIGH alert
↓
Webhook sent to n8n
↓
Telegram alert sent
↓
Email alert sent
↓
Wait 2 minutes
↓
Check acknowledgement
↓
If NOT acknowledged:
Escalate incident
↓
Generate AI Nurse Report
↓
Send escalation summary
↓
Create incident log
```

---

# n8n Workflow Components

The workflow includes:

- Webhook Trigger
- HTTP Request Nodes
- IF Nodes
- Wait Nodes
- Telegram Integration
- Gmail Integration
- Optional Google Sheets logging

---

# Example Alert Payload

```json
{
  "patient_id": "P1001",
  "patient_name": "John Doe",
  "risk_score": 82,
  "severity": "HIGH",
  "latest_vitals": {
    "heart_rate": 132,
    "spo2": 88,
    "temperature": 39.1,
    "respiratory_rate": 30
  },
  "explanations": [
    "Heart rate rising steadily",
    "Oxygen saturation decreasing",
    "Respiratory distress worsening"
  ]
}
```

---

# ICU Timeline Replay Mode

The dashboard includes a replay mode for realistic demonstrations.

Features include:

- replay deterioration timeline
- replay vitals evolution
- replay risk escalation
- replay alerts
- replay explainability changes

---

# Example Timeline

```text
10:01 → Stable
10:05 → HR rising
10:10 → SpO2 falling
10:15 → HIGH ALERT
10:16 → n8n escalation triggered
```

---

# Dashboard Features

The ICU dashboard includes:

- live vitals monitoring
- risk score badges
- alert banners
- AI nurse summaries
- intervention recommendations
- deterioration timelines
- historical charts
- replay visualization

---

# Node Backend Structure

```text
node_backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── uploads/
│
├── server.js
├── package.json
└── .env
```

---

# FastAPI Backend Structure

```text
ai_backend/
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

# Installation Guide

# Clone Repository

```bash
git clone <repository-url>
cd sentri
```

---

# Setup Node Backend

```bash
cd node_backend

npm install
npm run dev
```

---

# Setup AI Backend

```bash
cd ai_backend

python -m venv venv
```

## Windows

```bash
venv\Scripts\activate
```

## Mac/Linux

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Start FastAPI Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

---

# Setup Main Dashboard

```bash
cd main_dashboard

npm install
npm run dev
```

---

# Setup Simulation Dashboard

```bash
cd simulation_dashboard

npm install
npm run dev
```

---

# Environment Variables

## Node Backend

```env
PORT=5000

MONGO_URI=your_mongodb_uri

GROQ_API_KEY=your_groq_api_key

AI_BACKEND_URL=https://your-fastapi-url/predict

N8N_WEBHOOK_URL=https://your-n8n-webhook-url
```

---

# Deployment

## Node Backend

- Railway
- Render

## FastAPI Backend

- Railway

## Database

- MongoDB Atlas

## Workflow Automation

- n8n Cloud / Self-hosted

---

# Important Deployment Note

Never use:

- localhost
- 127.0.0.1

inside deployed environments.

Always use deployed service URLs.

---

# Current Priority

Current implementation priorities:

1. AI Nurse Summary endpoint
2. Intervention Recommendation Engine
3. n8n ICU Alert Escalation Workflow
4. AI Nurse Report generation
5. Lightweight ICU Timeline Replay Mode

---

# Important Disclaimer

Sentri is:

- educational
- simulated
- demo-oriented

This project is:

- NOT a medical device
- NOT approved for clinical use
- NOT medical advice

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
Explainability Engine
      ↓
AI Nurse Summary
      ↓
Intervention Recommendations
      ↓
Alert Generation
      ↓
n8n Escalation Workflow
      ↓
Telegram + Email Notifications
      ↓
Dashboard Visualization
```

---

# Conclusion

Sentri combines:

- temporal physiological intelligence
- explainable machine learning
- LLM-powered clinical summaries
- real-time ICU monitoring
- workflow automation
- escalation orchestration
- dashboard visualization

to build a realistic ICU deterioration monitoring and escalation platform capable of simulating autonomous hospital intelligence workflows.
