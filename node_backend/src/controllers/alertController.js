const Alert = require("../models/Alert");

const getPatientAlerts = async (req, res) => {
  try {
    const { patientId } = req.params;

    const alerts = await Alert.find({
      patient_id: patientId,
    }).sort({
      timestamp: -1,
    });

    res.status(200).json({
      success: true,
      alerts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const acknowledgeAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findByIdAndUpdate(
      alertId,
      {
        acknowledged: true,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      alert,
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
  getPatientAlerts,
  acknowledgeAlert,
};
