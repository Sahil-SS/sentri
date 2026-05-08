const { z } = require("zod");

const historySchema = z.object({
  age: z.number().nullable(),

  age_60_plus: z.union([
    z.literal(0),
    z.literal(1),
  ]),

  diabetes: z.union([
    z.literal(0),
    z.literal(1),
  ]),

  smoker: z.union([
    z.literal(0),
    z.literal(1),
  ]),

  heart_disease: z.union([
    z.literal(0),
    z.literal(1),
  ]),

  kidney_disease: z.union([
    z.literal(0),
    z.literal(1),
  ]),

  baseline_sbp: z.number().nullable(),

  baseline_dbp: z.number().nullable(),

  baseline_hr: z.number().nullable(),

  bmi: z.number().nullable(),
});

module.exports = historySchema;