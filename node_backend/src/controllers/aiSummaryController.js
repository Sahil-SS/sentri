const Patient = require("../models/Patient");

const Vitals = require("../models/Vitals");

const Prediction = require("../models/Prediction");

const { generateAISummary } = require("../services/aiSummaryService");

// -------------------------
// GENERATE AI SUMMARY
// -------------------------

const getAISummary = async (req, res) => {
  try {
    const { patientId } = req.params;

    // -------------------------
    // FETCH PATIENT
    // -------------------------

    const patient = await Patient.findOne({
      patient_id: patientId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // -------------------------
    // FETCH LATEST VITALS
    // -------------------------

    const latestVitals = await Vitals.findOne({
      patient_id: patientId,
    }).sort({
      timestamp: -1,
    });

    // -------------------------
    // FETCH LATEST PREDICTION
    // -------------------------

    const latestPrediction = await Prediction.findOne({
      patient_id: patientId,
    }).sort({
      timestamp: -1,
    });

    if (!latestVitals || !latestPrediction) {
      return res.status(404).json({
        success: false,
        message: "Vitals or prediction not found",
      });
    }

    // -------------------------
    // GENERATE SUMMARY
    // -------------------------

    const result = await generateAISummary({
      latestVitals,
      latestPrediction,
    });

    // -------------------------
    // RESPONSE
    // -------------------------

    res.status(200).json({
      success: true,

      patient_id: patientId,

      summary: result.summary,

      recommendations: result.recommendations,
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
  getAISummary,
};
