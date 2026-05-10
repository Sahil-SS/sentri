const Vitals = require("../models/Vitals");

const Patient = require("../models/Patient");

const Prediction = require("../models/Prediction");

const axios = require("axios");

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

    let severity = "low";

    if (predictionResponse.risk_score >= 90) {
      severity = "high";
    } else if (predictionResponse.risk_score >= 50) {
      severity = "moderate";
    }

    const prediction = await Prediction.create({
      patient_id,

      timestamp: new Date(),

      risk_score: predictionResponse.risk_score,

      severity,

      explanation: predictionResponse.explanations,
    });

    // -------------------------
    // CREATE ALERTS
    // -------------------------

    if (predictionResponse.risk_score >= 90) {
      // -------------------------
      // CREATE ALERT
      // -------------------------

      await createAlert(
        patient_id,
        "high",
        "High sepsis deterioration risk detected",
      );

      // -------------------------
      // TRIGGER N8N WORKFLOW
      // -------------------------
      console.log("TRIGGERING N8N WORKFLOW");

      console.log(process.env.N8N_WEBHOOK_URL);
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          patient_id,

          patient_name: patient.name || patient_id,

          risk_score: predictionResponse.risk_score,

          severity,

          is_acknowledged: false,

          latest_vitals: {
            heart_rate,

            spo2,

            temperature,

            respiratory_rate,

            systolic_bp,

            mean_arterial_pressure,
          },

          explanations: predictionResponse.explanations || [],
        });

        console.log("n8n workflow triggered successfully");
      } catch (error) {
        console.log("n8n workflow trigger failed");

        console.log(error.message);
      }
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
