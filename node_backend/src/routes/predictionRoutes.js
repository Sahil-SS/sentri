const express = require("express");

const { getPredictionHistory } = require("../controllers/predictionController");

const router = express.Router();

router.get("/:patientId", getPredictionHistory);

module.exports = router;
