const express = require("express");
const router = express.Router();

const {
  receiveVitals,
} = require("../controllers/vitalsController");

router.post("/", receiveVitals);

module.exports = router;