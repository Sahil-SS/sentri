const express = require("express");

const { getAISummary } = require("../controllers/aiSummaryController");

const router = express.Router();

// -------------------------
// AI SUMMARY
// -------------------------

router.post("/summary/:patientId", getAISummary);

module.exports = router;
