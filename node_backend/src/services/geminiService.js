const Groq = require("groq-sdk");

const historySchema = require(
  "../utils/historySchema"
);

const {
  MEDICAL_HISTORY_PROMPT,
} = require("../utils/prompts");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// -------------------------
// NORMALIZATION
// -------------------------

const normalizeData = (data) => {

  return {

    // -------------------------
    // DEMOGRAPHICS
    // -------------------------

    name:
      data.name || null,

    gender:
      data.gender || null,

    age:
      data.age != null
        ? Number(data.age)
        : null,

    age_60_plus:
      Number(data.age) >= 60
        ? 1
        : 0,

    // -------------------------
    // COMORBIDITIES
    // -------------------------

    diabetes:
      Number(data.diabetes) === 1
        ? 1
        : 0,

    smoker:
      Number(data.smoker) === 1
        ? 1
        : 0,

    smoking_years:
      data.smoking_years != null
        ? Number(
            data.smoking_years
          )
        : null,

    alcohol_use:
      Number(data.alcohol_use) === 1
        ? 1
        : 0,

    heart_disease:
      Number(data.heart_disease) === 1
        ? 1
        : 0,

    kidney_disease:
      Number(data.kidney_disease) === 1
        ? 1
        : 0,

    hypertension:
      Number(data.hypertension) === 1
        ? 1
        : 0,

    obesity:
      Number(data.obesity) === 1
        ? 1
        : 0,

    copd:
      Number(data.copd) === 1
        ? 1
        : 0,

    asthma:
      Number(data.asthma) === 1
        ? 1
        : 0,

    liver_disease:
      Number(data.liver_disease) === 1
        ? 1
        : 0,

    stroke_history:
      Number(
        data.stroke_history
      ) === 1
        ? 1
        : 0,

    immunocompromised:
      Number(
        data.immunocompromised
      ) === 1
        ? 1
        : 0,

    prior_sepsis:
      Number(
        data.prior_sepsis
      ) === 1
        ? 1
        : 0,

    prior_icu_admission:
      Number(
        data.prior_icu_admission
      ) === 1
        ? 1
        : 0,

    recent_surgery:
      Number(
        data.recent_surgery
      ) === 1
        ? 1
        : 0,

    // -------------------------
    // BASELINES
    // -------------------------

    baseline_sbp:
      data.baseline_sbp != null
        ? Number(
            data.baseline_sbp
          )
        : null,

    baseline_dbp:
      data.baseline_dbp != null
        ? Number(
            data.baseline_dbp
          )
        : null,

    baseline_hr:
      data.baseline_hr != null
        ? Number(
            data.baseline_hr
          )
        : null,

    baseline_spo2:
      data.baseline_spo2 != null
        ? Number(
            data.baseline_spo2
          )
        : null,

    bmi:
      data.bmi != null
        ? Number(data.bmi)
        : null,

    // -------------------------
    // LIFESTYLE
    // -------------------------

    physical_activity:
      data.physical_activity ||
      null,

    // -------------------------
    // MEDICATIONS
    // -------------------------

    medications:
      Array.isArray(
        data.medications
      )
        ? data.medications
        : [],
  };
};

// -------------------------
// MAIN PARSER
// -------------------------

const parseMedicalHistory =
  async (historyText) => {

    try {

      const completion =
        await groq.chat.completions.create({
          model:
            "llama-3.3-70b-versatile",

          temperature: 0,

          messages: [
            {
              role: "system",

              content:
                MEDICAL_HISTORY_PROMPT,
            },

            {
              role: "user",

              content: historyText,
            },
          ],
        });

      const rawText =
        completion.choices[0]
          .message.content;

      console.log(
        "RAW GROQ RESPONSE:"
      );

      console.log(rawText);

      // -------------------------
      // CLEAN RESPONSE
      // -------------------------

      const cleanedText =
        rawText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      // -------------------------
      // EXTRACT JSON
      // -------------------------

      const jsonMatch =
        cleanedText.match(
          /\{[\s\S]*\}/
        );

      if (!jsonMatch) {

        throw new Error(
          "No valid JSON found"
        );
      }

      // -------------------------
      // PARSE JSON
      // -------------------------

      const parsedJSON =
        JSON.parse(
          jsonMatch[0]
        );

      // -------------------------
      // NORMALIZE
      // -------------------------

      const normalizedData =
        normalizeData(
          parsedJSON
        );

      // -------------------------
      // VALIDATE
      // -------------------------

      const validatedData =
        historySchema.parse(
          normalizedData
        );

      return validatedData;

    } catch (error) {

      console.log(
        "Groq Parsing Error:"
      );

      console.log(error);

      return {
        success: false,
        message: "Data not parsed",
      };
    }
};

module.exports = {
  parseMedicalHistory,
};