# SENTRI — Autonomous ICU Deterioration Monitoring & Escalation Platform

> **Built by Team H2Edge** for **NMIT Hacks Hackathon 2026**
> Nitte Meenakshi Institute of Technology, Bengaluru

---

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
├── ai-backend/
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

**Important:** Predictions only begin after 6 vitals have been collected. The first 5 vitals warm up the system.

Example:

```text
V1 V2 V3 V4 V5       → No prediction (warming up)

V1 V2 V3 V4 V5 V6    → Prediction 1

V2 V3 V4 V5 V6 V7    → Prediction 2

V3 V4 V5 V6 V7 V8    → Prediction 3
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

| Feature Type       | Purpose                   |
| ------------------ | ------------------------- |
| Mean               | Average patient condition |
| Standard Deviation | Physiological variability |
| Slope              | Deterioration direction   |
| Acceleration       | Deterioration speed       |
| Baseline Delta     | Deviation from baseline   |

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

## Patient History

- age
- age_60_plus
- diabetes
- smoker
- heart_disease
- kidney_disease
- baseline_hr
- baseline_sbp
- baseline_dbp
- bmi

---

# Model Details

## ML Model

Sentri uses:

- XGBoost Classifier
- Temporal deterioration analysis
- Rolling window inference
- Continuous risk scoring

### Final Model Hyperparameters

```python
XGBClassifier(
    n_estimators=200,
    max_depth=7,
    learning_rate=0.04,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric="logloss",
    scale_pos_weight=42.64   # handles class imbalance
)
```

### Dataset

- Total samples: 546,123 raw ICU readings
- After feature engineering: 461,781 windowed samples
- Class distribution: ~451,200 stable (97.7%) / ~10,581 sepsis (2.3%)
- Train/test split: 80/20 stratified

### Model Performance

| Metric            | Score |
| ----------------- | ----- |
| Accuracy          | 0.872 |
| ROC AUC           | 0.894 |
| Recall (Sepsis)   | 0.717 |
| F1 Score (Sepsis) | 0.205 |

> Note: Recall is prioritized over precision for sepsis detection — missing a true sepsis case is far more costly than a false alarm.

### Feature Count

The final model uses **28 engineered features** (24 temporal + 4 acceleration features added in the second training run).

---

# Risk Score Smoothing

Raw XGBoost probabilities are smoothed using exponential smoothing to prevent noisy prediction spikes:

```python
def smooth_risk_scores(scores, alpha=0.25):
    smoothed = []
    previous = scores[0]
    for score in scores:
        current = alpha * score + (1 - alpha) * previous
        smoothed.append(current)
        previous = current
    return smoothed
```

`alpha=0.25` balances responsiveness to new vitals with stability against noise.

---

# Important Prediction Logic

```python
probability = model.predict_proba(feature_vector)[0][1] * 100
```

### Class Mapping

| Class | Meaning            |
| ----- | ------------------ |
| 0     | Stable / Low Risk  |
| 1     | Sepsis / High Risk |

> **Important:** The model uses `predict_proba[:, 1]` — the probability of Class 1 (sepsis/deterioration) is used as the raw risk score. This is confirmed by the trained model behaviour in the notebook.

---

# Risk Thresholds

These thresholds match the AI Risk Escalation Zones implemented in the trained model notebook:

| Risk Score | Severity |
| ---------- | -------- |
| 0–30       | low      |
| 30–60      | moderate |
| 60–100     | high     |

### Severity Color Mapping (Frontend)

| Severity | Color            |
| -------- | ---------------- |
| low      | Green (#00ff7f)  |
| moderate | Yellow (#ffaa00) |
| high     | Red (#ff3333)    |

> **Important:** The severity label returned by the backend is `"moderate"` (not `"medium"`). The frontend must check for `"moderate"` to correctly display yellow coloring.

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

Alerts are triggered when `risk_score >= 90`.

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
  "severity": "high",
  "is_acknowledged": false,
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

> **Important:** The n8n webhook URL must be clean — no surrounding quotes, no trailing semicolon.
>
> Correct: `https://vrexx.app.n8n.cloud/webhook/sentri-alert`
>
> Wrong: `"https://vrexx.app.n8n.cloud/webhook/sentri-alert";`

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
10:01 → Stable (GREEN)
10:05 → HR rising (GREEN → YELLOW)
10:10 → SpO2 falling (YELLOW)
10:15 → HIGH ALERT (RED)
10:16 → n8n escalation triggered
```

---

# Test Patients

| Patient ID   | Profile                | Expected State         |
| ------------ | ---------------------- | ---------------------- |
| P_CRIT_100   | Critical septic shock  | HIGH risk / RED        |
| P_MED_200    | Moderate deterioration | MODERATE risk / YELLOW |
| P_STABLE_300 | Stable recovery        | LOW risk / GREEN       |

---

# Dashboard Features

The ICU dashboard includes:

- live vitals monitoring
- risk score badges (GREEN / YELLOW / RED)
- alert banners
- AI nurse summaries
- intervention recommendations
- deterioration timelines
- historical charts
- replay visualization

---

# Scenario Queue System

The simulation dashboard supports queued deterioration scenarios for realistic temporal progression.

Scenarios:

- Stable Recovery
- Moderate Deterioration
- Septic Shock

Each scenario runs for a configured number of vitals cycles before progressing to the next, enabling natural transitions:

```text
stable → moderate → septic
```

---

# Node Backend Structure

```
node-backend
├── 📁 src
│   ├── 📁 config
│   │   └── 📄 db.js
│   ├── 📁 controllers
│   │   ├── 📄 aiSummaryController.js
│   │   ├── 📄 alertController.js
│   │   ├── 📄 dashboardController.js
│   │   ├── 📄 patientController.js
│   │   ├── 📄 predictionController.js
│   │   └── 📄 vitalController.js
│   ├── 📁 middleware
│   │   └── 📄 errorMiddleware.js
│   ├── 📁 models
│   │   ├── 📄 Alert.js
│   │   ├── 📄 Patient.js
│   │   ├── 📄 Prediction.js
│   │   └── 📄 Vitals.js
│   ├── 📁 routes
│   │   ├── 📄 aiSummaryRoutes.js
│   │   ├── 📄 alertRoutes.js
│   │   ├── 📄 dashboardRoutes.js
│   │   ├── 📄 patientRoutes.js
│   │   ├── 📄 predictionRoutes.js
│   │   └── 📄 vitalRoutes.js
│   ├── 📁 services
│   │   ├── 📄 aiService.js
│   │   ├── 📄 aiSummaryService.js
│   │   ├── 📄 alertService.js
│   │   ├── 📄 geminiService.js
│   │   └── 📄 pdfService.js
│   ├── 📁 utils
│   │   ├── 📄 historySchema.js
│   │   └── 📄 prompts.js
│   └── 📄 app.js
├── ⚙️ .gitignore
├── 📝 API_DOC.md
├── 📝 Readme.md
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── 📄 server.js
```

---

# FastAPI Backend Structure

```
ai-backend
├── 📁 app
│   ├── 🐍 explanations.py
│   ├── 🐍 feature_engineering.py
│   ├── 🐍 main.py
│   ├── 🐍 model_loader.py
│   ├── 🐍 predictor.py
│   ├── 🐍 schemas.py
│   └── 🐍 utils.py
├── 📁 models
│   ├── 📄 feature_columns.pkl
│   └── 📄 sentri_xgboost_model.pkl
├── ⚙️ .gitignore
├── 📄 Procfile
├── 📝 README.md
├── 📄 requirements.txt
└── 📄 runtime.txt
```

# Main Dashbaord Structure

```
main_dashboard
├── 📁 app
│   ├── 📁 dashboard
│   │   └── 📄 page.tsx
│   ├── 📄 favicon.ico
│   ├── 🎨 globals.css
│   ├── 📄 layout.tsx
│   └── 📄 page.tsx
├── 📁 backend
│   └── 📄 api.ts
├── 📁 components
│   ├── 📁 contact
│   │   ├── 📄 ContactForm.tsx
│   │   ├── 📄 ContactSection.tsx
│   │   └── 📄 ContactTerminal.tsx
│   ├── 📁 footer
│   │   └── 📄 Footer.tsx
│   ├── 📁 hero
│   │   ├── 📄 DataStream.tsx
│   │   ├── 📄 EcgWave.tsx
│   │   ├── 📄 HeroSection.tsx
│   │   ├── 📄 HeroText.tsx
│   │   ├── 📄 HeroVisual.tsx
│   │   └── 📄 ThreatArcHero.tsx
│   ├── 📁 navbar
│   │   ├── 📄 MobileMenu.tsx
│   │   └── 📄 Navbar.tsx
│   ├── 📁 overview
│   │   ├── 📄 ComparisonGrid.tsx
│   │   ├── 📄 OverviewSection.tsx
│   │   ├── 📄 ProblemPanel.tsx
│   │   └── 📄 StatMonuments.tsx
│   ├── 📁 shared
│   │   ├── 📄 AmberCursor.tsx
│   │   ├── 📄 Button.tsx
│   │   ├── 📄 Panel.tsx
│   │   ├── 📄 ScrollProgress.tsx
│   │   ├── 📄 SectionHeader.tsx
│   │   └── 📄 Separator.tsx
│   ├── 📁 team
│   │   ├── 📄 TeamCard.tsx
│   │   ├── 📄 TeamGrid.tsx
│   │   └── 📄 TeamSection.tsx
│   └── 📁 technology
│       ├── 📄 ArchDiagram.tsx
│       ├── 📄 RollingWindowViz.tsx
│       ├── 📄 TechSection.tsx
│       └── 📄 TechStackGrid.tsx
├── 📁 lib
│   └── 📄 nav-links.ts
├── 📁 public
│   ├── 🖼️ file.svg
│   ├── 🖼️ globe.svg
│   ├── 🖼️ next.svg
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
├── 📁 styles
│   ├── 🎨 animations.css
│   ├── 🎨 buttons.css
│   ├── 🎨 panels.css
│   ├── 🎨 tokens.css
│   └── 🎨 typography.css
├── ⚙️ .gitignore
├── 📝 AGENTS.md
├── 📝 CLAUDE.md
├── 📝 README.md
├── 📄 eslint.config.mjs
├── 📄 next.config.ts
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.mjs
├── 📄 tailwind.config.ts
└── ⚙️ tsconfig.json
```

# Simulation Dashbaord Structure

```
simulation_dashboard
├── 📁 app
│   ├── 📄 favicon.ico
│   ├── 🎨 globals.css
│   ├── 📄 layout.tsx
│   └── 📄 page.jsx
├── 📁 public
│   ├── 📄 Simulated_Dataset.csv
│   ├── 🖼️ file.svg
│   ├── 🖼️ globe.svg
│   ├── 🖼️ next.svg
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
├── 📁 src
│   ├── 📁 components
│   │   ├── 📄 Header.jsx
│   │   ├── 📄 PatientSelector.jsx
│   │   ├── 📄 StatusBar.jsx
│   │   ├── 📄 VitalPanel.jsx
│   │   ├── 📄 VitalsMonitor.jsx
│   │   └── 📄 WaveformChannel.jsx
│   ├── 📁 context
│   │   └── 📄 VitalsContext.jsx
│   ├── 📁 hooks
│   │   └── 📄 useVitalsSimulator.js
│   └── 📁 lib
│       ├── 📄 UsePatientData.js
│       ├── 📄 api.js
│       ├── 📄 dataLoader.js
│       └── 📄 waveformUtils.js
├── ⚙️ .gitignore
├── 📝 AGENTS.md
├── 📝 CLAUDE.md
├── 📝 README.md
├── 📄 eslint.config.mjs
├── 📄 next.config.ts
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.mjs
└── ⚙️ tsconfig.json
```

---

# Installation Guide

## Clone Repository

```bash
git clone <repository-url>
cd sentri
```

---

## Setup Node Backend

```bash
cd node_backend

npm install
npm run dev
```

---

## Setup AI Backend

```bash
cd ai_backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start FastAPI Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

---

## Setup Main Dashboard

```bash
cd main_dashboard

npm install
npm run dev
```

---

## Setup Simulation Dashboard

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

> **Important:** `dotenv` must load **before** all other imports in `server.js`:
>
> ```js
> require("dotenv").config();
> ```

---

# Deployment

## Node Backend

- Railway

## FastAPI Backend

- Railway

## Database

- MongoDB Atlas

## Workflow Automation

- n8n Cloud / Self-hosted

## FrontEnd / Dashboards

- Vercel

> **Important:** Never use `localhost` or `127.0.0.1` in deployed environments. Always use deployed service URLs.

---

# Live Deployed Links

| Service                 | URL                                                   |
| ----------------------- | ----------------------------------------------------- |
| 🖥️ Main Dashboard       | `https://sentri-ll6c.vercel.app/`                     |
| 🧪 Simulation Dashboard | `https://sentri-simu.vercel.app/`                     |
| ⚙️ Node Backend         | `https://loyal-magic-production-0fce.up.railway.app/` |
| 🤖 AI/ML Backend        | `https://sentri-production.up.railway.app/`           |

---

# Important Backend Field Names

The frontend **must** send vitals using these exact field names:

| Correct                  | Wrong       |
| ------------------------ | ----------- |
| `respiratory_rate`       | `resp_rate` |
| `mean_arterial_pressure` | `map`       |

---

# Important Rolling Window Logic

Node.js must fetch vitals newest-first, then reverse before sending to FastAPI so the AI receives oldest → newest temporal order:

```js
const vitals = await Vitals.find({ patient_id })
  .sort({ timestamp: -1 })
  .limit(6);

const vitalsWindow = vitals.reverse();
```

---

# Known Bugs Fixed

| Bug                         | Cause                                                           | Fix                                                          |
| --------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| Moderate risk showing green | Frontend checked `"medium"` but backend returns `"moderate"`    | Updated all severity checks to `"moderate"`                  |
| Vitals firing too rapidly   | `useCallback` depended on `scenarioQueue`, recreating intervals | Changed dependency array to `[]`                             |
| Double-slash in API URLs    | Trailing slash in `BASE` URL constant                           | Removed trailing slash                                       |
| Wrong vitals field names    | Frontend used `resp_rate` and `map`                             | Corrected to `respiratory_rate` and `mean_arterial_pressure` |
| FastAPI 422 errors          | Null history fields sent in payload                             | Replaced with `field ?? 0` fallback                          |
| n8n webhook failing         | Quotes and semicolon in Railway env var                         | Set clean URL without quotes or semicolons                   |
| `axios is not defined`      | Missing import in controller                                    | Added `const axios = require("axios")`                       |
| `GROQ_API_KEY` missing      | dotenv loaded after imports                                     | Moved `require("dotenv").config()` to top of `server.js`     |

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
