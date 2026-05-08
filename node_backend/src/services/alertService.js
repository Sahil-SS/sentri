const Alert = require("../models/Alert");

const createAlert = async (
  patient_id,
  severity,
  message
) => {

  return await Alert.create({
    patient_id,
    severity,
    message,
    timestamp: new Date(),
  });
};

module.exports = {
  createAlert,
};