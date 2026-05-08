const express = require("express");

const { getPatientDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/:patientId", getPatientDashboard);

module.exports = router;
