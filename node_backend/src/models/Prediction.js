const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  patient_id: String,
  timestamp: Date,
  risk_score: Number,
  severity: String,
  explanation: [String],
});

module.exports = mongoose.model("Prediction", predictionSchema);