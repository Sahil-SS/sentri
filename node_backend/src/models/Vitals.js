const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema({
  patient_id: String,
  age: Number,
  timestamp: Date,
  heart_rate: Number,
  spo2: Number,
  temperature: Number,
});

module.exports = mongoose.model("Vitals", vitalsSchema);