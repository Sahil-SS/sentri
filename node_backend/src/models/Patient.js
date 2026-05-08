const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({

  patient_id: {
    type: String,
    required: true,
    unique: true
  },

  age: Number,

  diabetes: Number,

  smoker: Number,

  heart_disease: Number,

  kidney_disease: Number,

  baseline_hr: Number,

  baseline_sbp: Number,

  baseline_dbp: Number,

  bmi: Number
});

module.exports = mongoose.model(
  "Patient",
  patientSchema
);