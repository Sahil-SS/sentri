const axios = require("axios");

const predictSepsisRisk = async (
  patient,
  vitalsWindow
) => {

  const payload = {
    patient_id: patient.patient_id,

    history: {
      age: patient.age,
      diabetes: patient.diabetes,
      smoker: patient.smoker,
      heart_disease:
        patient.heart_disease,
      kidney_disease:
        patient.kidney_disease,
      baseline_hr:
        patient.baseline_hr,
      baseline_sbp:
        patient.baseline_sbp,
      baseline_dbp:
        patient.baseline_dbp,
      bmi: patient.bmi,
    },

    vitals_window: vitalsWindow.map(
      (vital) => ({
        hr: vital.heart_rate,
        spo2: vital.spo2,
        temp: vital.temperature,
        resp: vital.respiratory_rate,
        sbp: vital.systolic_bp,
        map:
          vital.mean_arterial_pressure,
      })
    ),
  };

//   const response = await axios.post(
//     process.env.PYTHON_AI_URL||"http://localhost:8080/predict",
//     payload
//   );
  const response = await axios.post(
    `${process.env.AI_BACKEND_URL}/predict`,
    payload
  );
  return response.data;
};

module.exports = {
  predictSepsisRisk,
};