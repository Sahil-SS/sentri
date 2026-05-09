from pydantic import BaseModel

from typing import List


# ------------------------------------------
# Single rolling vital reading
# ------------------------------------------

class VitalReading(BaseModel):

    hr: float

    spo2: float

    temp: float

    resp: float

    sbp: float

    map: float


# ------------------------------------------
# Patient medical history
# ------------------------------------------

class PatientHistory(BaseModel):

    age: int

    diabetes: int

    smoker: int

    heart_disease: int

    kidney_disease: int

    baseline_hr: float

    baseline_sbp: float

    baseline_dbp: float

    bmi: float


# ------------------------------------------
# Full prediction request
# ------------------------------------------

class PredictionRequest(BaseModel):

    patient_id: str

    history: PatientHistory

    vitals_window: List[VitalReading]