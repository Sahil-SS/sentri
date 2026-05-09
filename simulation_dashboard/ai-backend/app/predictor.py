from app.model_loader import (
    model,
    feature_columns
)

from app.feature_engineering import (
    create_feature_vector
)

from app.explanations import (
    generate_explanations
)


# ------------------------------------------
# Predict deterioration risk
# ------------------------------------------

def predict_risk(request):

    # --------------------------------------
    # Feature engineering
    # --------------------------------------

    features = create_feature_vector(
        request
    )

    # --------------------------------------
    # Ensure exact training order
    # --------------------------------------

    features = features[
        feature_columns
    ]

    # --------------------------------------
    # DEBUG FEATURE VECTOR
    # --------------------------------------

    print("\nFEATURE VECTOR:")
    print(features)

    # --------------------------------------
    # Predict probabilities
    # --------------------------------------

    probas = model.predict_proba(
        features
    )[0]

    print("\nRAW PROBABILITIES:")
    print(probas)

    # --------------------------------------
    # IMPORTANT:
    # Using class 0 probability
    # as deterioration risk
    # --------------------------------------

    probability = (
        probas[0] * 100
    )

    # --------------------------------------
    # Severity thresholds
    # --------------------------------------

    if probability < 35:

        severity = "low"

    elif probability < 50:

        severity = "medium"

    else:

        severity = "high"

    # --------------------------------------
    # Explainability
    # --------------------------------------

    explanations = generate_explanations(
        features
    )

    # --------------------------------------
    # Final response
    # --------------------------------------

    return {

        "patient_id": str(
            request.patient_id
        ),

        "risk_score": float(
            round(probability, 2)
        ),

        "severity": str(
            severity
        ),

        "window_size": int(
            len(request.vitals_window)
        ),

        "explanations": [

            str(exp)

            for exp in explanations
        ]
    }