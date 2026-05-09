const Prediction = require("../models/Prediction");

const getPredictionHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const predictions = await Prediction.find({
      patient_id: patientId,
    }).sort({
      timestamp: -1,
    });

    res.status(200).json({
      success: true,
      predictions,
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
  getPredictionHistory,
};
