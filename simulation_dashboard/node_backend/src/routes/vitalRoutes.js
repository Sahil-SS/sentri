const express = require("express");

const { addVitals } = require("../controllers/vitalController");

const router = express.Router();

router.post("/", addVitals);

module.exports = router;
