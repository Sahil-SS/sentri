const Patient = require("../models/Patient");

const Vitals = require("../models/Vitals");

const Prediction = require("../models/Prediction");

const Alert = require("../models/Alert");

const getPatientDashboard = async (req, res) => {
  try {
    const { patientId } = req.params;

    // -------------------
    // PATIENT
    // -------------------

    const patient = await Patient.findOne({
      patient_id: patientId,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // -------------------
    // LATEST VITALS
    // -------------------

    const latestVitals = await Vitals.findOne({
      patient_id: patientId,
    }).sort({
      timestamp: -1,
    });

    // -------------------
    // LATEST PREDICTION
    // -------------------

    const latestPrediction = await Prediction.findOne({
      patient_id: patientId,
    }).sort({
      timestamp: -1,
    });

    // -------------------
    // ACTIVE ALERTS
    // -------------------

    const activeAlerts = await Alert.find({
      patient_id: patientId,
      acknowledged: false,
    }).sort({
      timestamp: -1,
    });

    // -------------------
    // HISTORICAL DATA
    // -------------------

    const historicalVitals = await Vitals.find({
      patient_id: patientId,
    })
      .sort({
        timestamp: -1,
      })
      .limit(50);

    const historicalPredictions = await Prediction.find({
      patient_id: patientId,
    })
      .sort({
        timestamp: -1,
      })
      .limit(50);

    // -------------------
    // RESPONSE
    // -------------------

    res.status(200).json({
      success: true,

      patient,

      latestVitals,

      latestPrediction,

      activeAlerts,

      historicalVitals,

      historicalPredictions,
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
  getPatientDashboard,
};
