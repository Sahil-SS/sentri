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
    # Create feature vector
    # --------------------------------------

    features = create_feature_vector(
        request
    )

    # --------------------------------------
    # Ensure correct column order
    # --------------------------------------

    features = features[
        feature_columns
    ]

    # --------------------------------------
    # Predict probability
    # --------------------------------------

    probability = (

        model.predict_proba(features)[0][1]

        * 100
    )

    # --------------------------------------
    # Determine severity
    # --------------------------------------

    if probability < 30:

        severity = "low"

    elif probability < 60:

        severity = "medium"

    else:

        severity = "high"

    # --------------------------------------
    # Generate explanations
    # --------------------------------------

    explanations = generate_explanations(
        features
    )

    return {

        "patient_id": str(request.patient_id),

        "risk_score": float(
        round(probability, 2)
    ),


        "severity": str(severity),

         "explanations": [
        str(exp)
        for exp in explanations
    ]
    }