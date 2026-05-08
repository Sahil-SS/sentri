const express = require("express");

const multer = require("multer");

const {
  registerPatient,
  getAllPatients,
  getSinglePatient,
} = require("../controllers/patientController");

const router = express.Router();

const upload = multer({
  dest: "src/uploads/",
});

// -------------------
// REGISTER
// -------------------

router.post("/register", upload.single("file"), registerPatient);

// -------------------
// GET ALL PATIENTS
// -------------------

router.get("/", getAllPatients);

// -------------------
// GET SINGLE PATIENT
// -------------------

router.get("/:patientId", getSinglePatient);

module.exports = router;
