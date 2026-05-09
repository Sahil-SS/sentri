const BASE_URL = "https://loyal-magic-production-0fce.up.railway.app";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

async function parseJSON(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Invalid JSON response from backend route: ${response.url}`,
    );
  }
}

const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

// ─────────────────────────────────────────────────────────────
// PATIENTS
// ─────────────────────────────────────────────────────────────

/*
  Pages:
  - Register Patient
  - ICU Dashboard
  - Patient Sidebar
*/

export interface RegisterPatientPayload {
  patient_id: string;
  history_text: string;
}

export interface Patient {
  _id: string;
  patient_id: string;
  age?: number;
  age_60_plus?: number;
  diabetes?: number;
  smoker?: number;
  heart_disease?: number;
  kidney_disease?: number;
  baseline_sbp?: number;
  baseline_dbp?: number;
  baseline_hr?: number;
  bmi?: number;
}

export interface RegisterPatientResponse {
  success: boolean;
  patient: Patient;
}

export const registerPatient = async (
  payload: RegisterPatientPayload,
): Promise<RegisterPatientResponse> => {
  const response = await fetch(`${BASE_URL}/api/patients/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to register patient");
  }

  return data;
};

// ─────────────────────────────────────────────────────────────
// GET ALL PATIENTS
// ─────────────────────────────────────────────────────────────

export interface GetPatientsResponse {
  success: boolean;
  patients: Patient[];
}

export const getPatients = async (): Promise<Patient[]> => {
  const response = await fetch(`${BASE_URL}/api/patients`, {
    headers: getHeaders(),
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch patients");
  }

  return data.patients ?? [];
};

// ─────────────────────────────────────────────────────────────
// GET SINGLE PATIENT
// ─────────────────────────────────────────────────────────────

export interface GetPatientResponse {
  success: boolean;
  patient: Patient;
}

export const getPatientById = async (patientId: string): Promise<Patient> => {
  if (!patientId) {
    throw new Error("patientId is required");
  }

  const response = await fetch(`${BASE_URL}/api/patients/${patientId}`, {
    headers: getHeaders(),
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch patient");
  }

  return data.patient;
};

// ─────────────────────────────────────────────────────────────
// VITALS
// ─────────────────────────────────────────────────────────────

/*
  Pages:
  - Simulator
  - Manual Vitals Entry
*/

export interface AddVitalsPayload {
  patient_id: string;
  heart_rate: number;
  spo2: number;
  temperature: number;
  respiratory_rate: number;
  systolic_bp: number;
  mean_arterial_pressure: number;
}

export interface Prediction {
  patient_id: string;
  risk_score: number;
  severity: "low" | "medium" | "high";
  explanation: string[];
}

export interface AddVitalsResponse {
  success: boolean;
  message?: string;
  vitals?: {
    patient_id: string;
    heart_rate: number;
    spo2: number;
  };
  prediction?: Prediction;
}

export const addVitals = async (
  payload: AddVitalsPayload,
): Promise<AddVitalsResponse> => {
  const response = await fetch(`${BASE_URL}/api/vitals`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to add vitals");
  }

  return data;
};

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────

/*
  Pages:
  - ICU Dashboard
  - Monitoring Screen
*/

export interface DashboardVitals {
  heart_rate: number;
  spo2: number;
  temperature: number;
  respiratory_rate?: number;
  systolic_bp?: number;
  mean_arterial_pressure?: number;
  timestamp?: string;
}

export interface DashboardPrediction {
  risk_score: number;
  severity: "low" | "medium" | "high";
  explanation?: string[];
  timestamp?: string;
}

export interface DashboardAlert {
  _id?: string;
  severity: "low" | "medium" | "high";
  message: string;
  acknowledged?: boolean;
  timestamp?: string;
}

export interface DashboardResponse {
  success: boolean;

  patient: Patient;

  latestVitals: DashboardVitals;

  latestPrediction: DashboardPrediction;

  activeAlerts: DashboardAlert[];

  historicalVitals: DashboardVitals[];

  historicalPredictions: DashboardPrediction[];
}

export const getDashboardData = async (
  patientId: string,
): Promise<DashboardResponse> => {
  if (!patientId) {
    throw new Error("patientId is required");
  }

  const response = await fetch(`${BASE_URL}/api/dashboard/${patientId}`, {
    headers: getHeaders(),
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard data");
  }

  return data;
};

// ─────────────────────────────────────────────────────────────
// PREDICTIONS
// ─────────────────────────────────────────────────────────────

/*
  Pages:
  - Analytics
  - Risk Timeline
  - Dashboard Graphs
*/

export interface PredictionHistoryItem {
  risk_score: number;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

export interface PredictionsResponse {
  success: boolean;
  predictions: PredictionHistoryItem[];
}

export const getPredictions = async (
  patientId: string,
): Promise<PredictionHistoryItem[]> => {
  if (!patientId) {
    throw new Error("patientId is required");
  }

  const response = await fetch(`${BASE_URL}/api/predictions/${patientId}`, {
    headers: getHeaders(),
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch predictions");
  }

  return data.predictions ?? [];
};

// ─────────────────────────────────────────────────────────────
// ALERTS
// ─────────────────────────────────────────────────────────────

/*
  Pages:
  - Alert Modal
  - Notification Center
*/

export interface Alert {
  _id: string;
  severity: "low" | "medium" | "high";
  message: string;
  acknowledged: boolean;
  timestamp?: string;
}

export interface AlertsResponse {
  success: boolean;
  alerts: Alert[];
}

export const getAlerts = async (patientId: string): Promise<Alert[]> => {
  if (!patientId) {
    throw new Error("patientId is required");
  }

  const response = await fetch(`${BASE_URL}/api/alerts/${patientId}`, {
    headers: getHeaders(),
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch alerts");
  }

  return data.alerts ?? [];
};

// ─────────────────────────────────────────────────────────────
// ACKNOWLEDGE ALERT
// ─────────────────────────────────────────────────────────────

export interface AcknowledgeAlertResponse {
  success: boolean;
  alert: {
    _id: string;
    acknowledged: boolean;
  };
}

export const acknowledgeAlert = async (
  alertId: string,
): Promise<AcknowledgeAlertResponse> => {
  if (!alertId) {
    throw new Error("alertId is required");
  }

  const response = await fetch(
    `${BASE_URL}/api/alerts/${alertId}/acknowledge`,
    {
      method: "PATCH",
      headers: getHeaders(),
    },
  );

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to acknowledge alert");
  }

  return data;
};
