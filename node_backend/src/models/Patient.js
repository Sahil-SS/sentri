const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    unique: true,
  },

  name: String,

  gender: String,

  age: Number,

  age_60_plus: Number,

  // -------------------
  // COMORBIDITIES
  // -------------------

  diabetes: Number,

  smoker: Number,

  smoking_years: Number,

  alcohol_use: Number,

  heart_disease: Number,

  kidney_disease: Number,

  hypertension: Number,

  obesity: Number,

  copd: Number,

  asthma: Number,

  liver_disease: Number,

  stroke_history: Number,

  immunocompromised: Number,

  prior_sepsis: Number,

  prior_icu_admission: Number,

  recent_surgery: Number,

  // -------------------
  // BASELINES
  // -------------------

  baseline_hr: Number,

  baseline_sbp: Number,

  baseline_dbp: Number,

  baseline_spo2: Number,

  bmi: Number,

  // -------------------
  // LIFESTYLE
  // -------------------

  physical_activity: String,

  // -------------------
  // MEDICATIONS
  // -------------------

  medications: [String],
});

module.exports = mongoose.model("Patient", patientSchema);
