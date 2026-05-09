import joblib # type: ignore

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

# ------------------------------------------
# DEBUG MODEL INFO
# ------------------------------------------

print("\nMODEL LOADED")

print("MODEL CLASSES:")
print(model.classes_)

print("EXPECTED FEATURES:")
print(feature_columns)