const Vitals = require("../models/Vitals");

const Patient = require("../models/Patient");

const Prediction = require("../models/Prediction");

const { predictSepsisRisk } = require("../services/aiService");

const { createAlert } = require("../services/alertService");

const addVitals = async (req, res) => {
  try {
    const {
      patient_id,
      heart_rate,
      spo2,
      temperature,
      respiratory_rate,
      systolic_bp,
      mean_arterial_pressure,
    } = req.body;

    // -------------------------
    // VERIFY PATIENT EXISTS
    // -------------------------

    const patient = await Patient.findOne({
      patient_id,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // -------------------------
    // STORE NEW VITALS
    // -------------------------

    const vitals = await Vitals.create({
      patient_id,
      heart_rate,
      spo2,
      temperature,
      respiratory_rate,
      systolic_bp,
      mean_arterial_pressure,
    });

    // -------------------------
    // FETCH LATEST 6 VITALS
    // -------------------------

    const latestVitals = await Vitals.find({
      patient_id,
    })
      .sort({
        timestamp: -1,
      })
      .limit(6);

    // -------------------------
    // REQUIRE 6 READINGS
    // -------------------------

    if (latestVitals.length < 6) {
      return res.status(200).json({
        success: true,
        message: `Vitals stored. Need ${
          6 - latestVitals.length
        } more readings for AI prediction.`,
        vitals,
      });
    }

    // -------------------------
    // CRITICAL TEMPORAL LOGIC
    // oldest -> newest
    // -------------------------

    const vitalsWindow = latestVitals.reverse();

    // -------------------------
    // CALL FASTAPI
    // -------------------------

    const predictionResponse = await predictSepsisRisk(patient, vitalsWindow);

    // -------------------------
    // STORE PREDICTION
    // -------------------------

    const prediction = await Prediction.create({
      patient_id,

      timestamp: new Date(),

      risk_score: predictionResponse.risk_score,

      severity: predictionResponse.severity,

      explanation: predictionResponse.explanations,
    });

    // -------------------------
    // CREATE ALERTS
    // -------------------------

    if (predictionResponse.risk_score >= 60) {
      await createAlert(
        patient_id,
        "high",
        "High sepsis deterioration risk detected",
      );
    }

    // -------------------------
    // RESPONSE
    // -------------------------

    res.status(201).json({
      success: true,

      vitals,

      prediction,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addVitals,
};
