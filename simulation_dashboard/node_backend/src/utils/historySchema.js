const { z } = require("zod");

const historySchema = z
  .object({

    // -------------------------
    // DEMOGRAPHICS
    // -------------------------

    name:
      z.string().nullable(),

    gender:
      z.string().nullable(),

    age:
      z.number().nullable(),

    age_60_plus:
      z.number(),

    // -------------------------
    // COMORBIDITIES
    // -------------------------

    diabetes:
      z.number(),

    smoker:
      z.number(),

    smoking_years:
      z.number().nullable(),

    alcohol_use:
      z.number(),

    heart_disease:
      z.number(),

    kidney_disease:
      z.number(),

    hypertension:
      z.number(),

    obesity:
      z.number(),

    copd:
      z.number(),

    asthma:
      z.number(),

    liver_disease:
      z.number(),

    stroke_history:
      z.number(),

    immunocompromised:
      z.number(),

    prior_sepsis:
      z.number(),

    prior_icu_admission:
      z.number(),

    recent_surgery:
      z.number(),

    // -------------------------
    // BASELINES
    // -------------------------

    baseline_sbp:
      z.number().nullable(),

    baseline_dbp:
      z.number().nullable(),

    baseline_hr:
      z.number().nullable(),

    baseline_spo2:
      z.number().nullable(),

    bmi:
      z.number().nullable(),

    // -------------------------
    // LIFESTYLE
    // -------------------------

    physical_activity:
      z.string().nullable(),

    // -------------------------
    // MEDICATIONS
    // -------------------------

    medications:
      z.array(z.string()),
  })
  .passthrough();

module.exports =
  historySchema;