import joblib

# ------------------------------------------
# Load trained model
# ------------------------------------------

model = joblib.load(
    "models/sentri_xgboost_model.pkl"
)

# ------------------------------------------
# Load feature order
# ------------------------------------------

feature_columns = joblib.load(
    "models/feature_columns.pkl"
)