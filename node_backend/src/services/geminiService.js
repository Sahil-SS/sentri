const { GoogleGenAI } = require("@google/genai");

const historySchema = require(
  "../utils/historySchema"
);

const {
  MEDICAL_HISTORY_PROMPT,
} = require("../utils/prompts");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const parseMedicalHistory = async (
  historyText
) => {
  try {

    const prompt = `
${MEDICAL_HISTORY_PROMPT}

PATIENT HISTORY:
${historyText}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

    const rawText =
      response.text;

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedJSON =
      JSON.parse(cleanedText);

    const validatedData =
      historySchema.parse(parsedJSON);

    return validatedData;

  } catch (error) {

    console.log(
      "Gemini SDK Error:",
      error
    );

    if (
      error.message?.includes("429")
    ) {
      throw new Error(
        "Gemini quota exceeded"
      );
    }

    throw new Error(
      "Medical history parsing failed"
    );
  }
};

module.exports = {
  parseMedicalHistory,
};