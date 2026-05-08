# ------------------------------------------
# Generate explainability messages
# ------------------------------------------

def generate_explanations(features):

    explanations = []

    if features["hr_slope"].iloc[0] > 2:

        explanations.append(
            "Heart rate rising steadily"
        )

    if features["spo2_slope"].iloc[0] < -0.5:

        explanations.append(
            "Oxygen saturation decreasing"
        )

    if features["temp_slope"].iloc[0] > 0.2:

        explanations.append(
            "Temperature increasing"
        )

    if features["resp_slope"].iloc[0] > 1:

        explanations.append(
            "Respiratory distress worsening"
        )

    if features["sbp_above_baseline"].iloc[0] < -10:

        explanations.append(
            "Blood pressure below baseline"
        )

    return explanations