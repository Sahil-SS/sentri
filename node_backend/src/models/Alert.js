const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  patient_id: String,
  severity: String,
  message: String,
  timestamp: Date,
  acknowledged: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Alert", alertSchema);