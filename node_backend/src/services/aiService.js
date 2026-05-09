const axios = require("axios");

const predictSepsisRisk = async (patient, vitalsWindow) => {
  const payload = {
    patient_id: patient.patient_id,

    history: {
      age: patient.age ?? 0,

      diabetes: patient.diabetes ?? 0,

      smoker: patient.smoker ?? 0,

      heart_disease: patient.heart_disease ?? 0,

      kidney_disease: patient.kidney_disease ?? 0,

      baseline_hr: patient.baseline_hr ?? 0,

      baseline_sbp: patient.baseline_sbp ?? 0,

      baseline_dbp: patient.baseline_dbp ?? 0,

      bmi: patient.bmi ?? 0,
    },

    vitals_window: vitalsWindow.map((vital) => ({
      hr: vital.heart_rate,
      spo2: vital.spo2,
      temp: vital.temperature,
      resp: vital.respiratory_rate,
      sbp: vital.systolic_bp,
      map: vital.mean_arterial_pressure,
    })),
  };

  //   const response = await axios.post(
  //     process.env.PYTHON_AI_URL||"http://localhost:8080/predict",
  //     payload
  //   );
  const response = await axios.post(
    `${process.env.AI_BACKEND_URL}/predict`,
    payload,
  );
  return response.data;
};

module.exports = {
  predictSepsisRisk,
};
