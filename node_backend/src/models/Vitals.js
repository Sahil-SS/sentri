const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

  // -----------------------------------
  // VITALS
  // -----------------------------------

  heart_rate: Number,

  spo2: Number,

  temperature: Number,

  respiratory_rate: Number,

  systolic_bp: Number,

  mean_arterial_pressure: Number,
});

module.exports = mongoose.model("Vitals", vitalsSchema);
