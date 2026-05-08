const express = require("express");

const multer = require("multer");

const {
  registerPatient,
} = require(
  "../controllers/patientController"
);

const router = express.Router();

const upload = multer({
  dest: "src/uploads/",
});

router.post(
  "/register",
  upload.single("file"),
  registerPatient
);

module.exports = router;