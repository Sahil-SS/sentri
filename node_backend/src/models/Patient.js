const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patient_id: String,
  name: String,
  age: Number,
});

module.exports = mongoose.model("Patient", patientSchema);