const fs = require("fs");

const pdfParse = require("pdf-parse");

// -------------------------
// Extract text from PDF
// -------------------------

const extractTextFromPDF = async (filePath) => {
  try {
    // -------------------------
    // Read PDF buffer
    // -------------------------

    const dataBuffer = fs.readFileSync(filePath);

    // -------------------------
    // Parse PDF
    // -------------------------

    const data = await pdfParse(dataBuffer);

    // -------------------------
    // Return extracted text
    // -------------------------

    return data.text;
  } catch (error) {
    console.log("PDF Extraction Error:");

    console.log(error);

    throw new Error("Failed to extract PDF text");
  }
};

module.exports = {
  extractTextFromPDF,
};
