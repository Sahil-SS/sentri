const express = require("express");

const {
  getPatientAlerts,
  acknowledgeAlert,
} = require("../controllers/alertController");

const router = express.Router();

router.get("/:patientId", getPatientAlerts);

router.patch("/:alertId/acknowledge", acknowledgeAlert);

module.exports = router;
