const Patient = require("../models/Patient");

const { parseMedicalHistory } = require("../services/geminiService");

const { extractTextFromPDF } = require("../services/pdfService");

const registerPatient = async (req, res) => {
  try {
    const { patient_id, history_text } = req.body;

    let finalHistoryText = history_text;

    if (req.file) {
      finalHistoryText = await extractTextFromPDF(req.file.path);
    }

    if (!finalHistoryText) {
      return res.status(400).json({
        message: "Medical history is required",
      });
    }

    //     const parsedHistory =
    //       await parseMedicalHistory(
    //         finalHistoryText
    //       );
    // MOCKED DATA FOR DEMO PURPOSES BECSUSE LLM IS NOT WORKING 
    const parsedHistory = {
      age: 67,
      age_60_plus: 1,
      diabetes: 1,
      smoker: 0,
      heart_disease: 1,
      kidney_disease: 0,
      baseline_sbp: 150,
      baseline_dbp: 95,
      baseline_hr: 82,
      bmi: 32,
    };

    const existingPatient = await Patient.findOne({
      patient_id,
    });

    if (existingPatient) {
      return res.status(400).json({
        message: "Patient already exists",
      });
    }

    const patient = await Patient.create({
      patient_id,
      ...parsedHistory,
    });

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

const getAllPatients =
  async (req, res) => {

    try {

      const patients =
        await Patient.find()
          .select(
            "patient_id name age"
          )
          .sort({
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

const getSinglePatient =
  async (req, res) => {

    try {

      const { patientId } =
        req.params;

      const patient =
        await Patient.findOne({
          patient_id: patientId,
        });

      if (!patient) {
        return res.status(404).json({
          message:
            "Patient not found",
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
