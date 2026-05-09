const Patient = require("../models/Patient");

const { parseMedicalHistory } = require("../services/geminiService");

const { extractTextFromPDF } = require("../services/pdfService");

// -------------------------
// REGISTER PATIENT
// -------------------------

const registerPatient = async (req, res) => {
  try {
    console.log("REQ BODY:");
    console.log(req.body);

    console.log("REQ FILE:");
    console.log(req.file);

    const patient_id = req.body?.patient_id;

    const history_text = req.body?.history_text;

    let finalHistoryText = history_text;

    // -------------------------
    // PDF SUPPORT
    // -------------------------

    if (req.file) {
      finalHistoryText = await extractTextFromPDF(req.file.path);
    }

    // -------------------------
    // VALIDATE INPUT
    // -------------------------

    if (!finalHistoryText) {
      return res.status(400).json({
        success: false,
        message: "Medical history is required",
      });
    }

    // -------------------------
    // PARSE MEDICAL HISTORY
    // -------------------------

    const parsedHistory = await parseMedicalHistory(finalHistoryText);

    // -------------------------
    // PARSING FAILED
    // -------------------------

    if (
      parsedHistory.success === false &&
      parsedHistory.message === "Data not parsed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Medical history could not be parsed",
      });
    }

    // -------------------------
    // CHECK EXISTING PATIENT
    // -------------------------

    const existingPatient = await Patient.findOne({
      patient_id,
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient already exists",
      });
    }

    // -------------------------
    // CREATE PATIENT
    // -------------------------

    const patient = await Patient.create({
      patient_id,
      ...parsedHistory,
    });

    // -------------------------
    // RESPONSE
    // -------------------------

    res.status(201).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -------------------------
// GET ALL PATIENTS
// -------------------------

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("patient_id age").sort({
      patient_id: 1,
    });

    res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -------------------------
// GET SINGLE PATIENT
// -------------------------

const getSinglePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOne({
      patient_id: patientId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
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
  registerPatient,
  getAllPatients,
  getSinglePatient,
};
