const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateAISummary = async ({ latestVitals, latestPrediction }) => {
  try {
    // -------------------------
    // RULE-BASED RECOMMENDATIONS
    // -------------------------

    const recommendations = [];

    if (latestVitals.spo2 < 92) {
      recommendations.push("Review oxygen support");
    }

    if (latestVitals.respiratory_rate > 24) {
      recommendations.push("Assess respiratory distress");
    }

    if (latestVitals.temperature > 38.5) {
      recommendations.push("Evaluate possible infection");
    }

    if (latestPrediction.risk_score > 70) {
      recommendations.push("Increase monitoring frequency");
    }

    // -------------------------
    // PROMPT
    // -------------------------

    const prompt = `
You are an ICU monitoring assistant.

Generate a concise ICU deterioration summary.

Risk Score:
${latestPrediction.risk_score}

Severity:
${latestPrediction.severity}

Vitals:
- Heart Rate: ${latestVitals.heart_rate}
- SpO2: ${latestVitals.spo2}
- Temperature: ${latestVitals.temperature}
- Respiratory Rate: ${latestVitals.respiratory_rate}

Detected Issues:
${latestPrediction.explanation.join(", ")}

Return ONLY JSON.

{
  "summary": "..."
}
`;

    // -------------------------
    // GROQ CALL
    // -------------------------

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      temperature: 0.3,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawText = completion.choices[0].message.content;

    console.log("AI SUMMARY RAW:");

    console.log(rawText);

    // -------------------------
    // CLEAN JSON
    // -------------------------

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No valid JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      summary: parsed.summary,
      recommendations,
    };
  } catch (error) {
    console.log("AI Summary Error:");

    console.log(error);

    return {
      summary: "Unable to generate ICU summary",
      recommendations: [],
    };
  }
};

module.exports = {
  generateAISummary,
};
