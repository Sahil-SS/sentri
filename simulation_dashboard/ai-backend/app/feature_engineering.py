import pandas as pd
import numpy as np

from app.utils import (
    calculate_slope,
    calculate_acceleration
)


# ------------------------------------------
# Convert rolling vitals into feature vector
# ------------------------------------------

def create_feature_vector(request):

    history = request.history

    vitals = request.vitals_window

    # --------------------------------------
    # Convert vitals into arrays
    # --------------------------------------

    hr_window = np.array([
        v.hr for v in vitals
    ])

    spo2_window = np.array([
        v.spo2 for v in vitals
    ])

    temp_window = np.array([
        v.temp for v in vitals
    ])

    resp_window = np.array([
        v.resp for v in vitals
    ])

    sbp_window = np.array([
        v.sbp for v in vitals
    ])

    map_window = np.array([
        v.map for v in vitals
    ])

    # --------------------------------------
    # Baseline deviations
    # --------------------------------------

    hr_above_baseline = (
        np.mean(hr_window)
        - history.baseline_hr
    )

    sbp_above_baseline = (
        np.mean(sbp_window)
        - history.baseline_sbp
    )

    # --------------------------------------
    # Feature dictionary
    # --------------------------------------

    feature_dict = {

        # HEART RATE

        "hr_mean": np.mean(hr_window),

        "hr_std": np.std(hr_window),

        "hr_slope": calculate_slope(hr_window),

        "hr_acceleration": calculate_acceleration(hr_window),

        "hr_above_baseline": hr_above_baseline,

        # SPO2

        "spo2_mean": np.mean(spo2_window),

        "spo2_std": np.std(spo2_window),

        "spo2_slope": calculate_slope(spo2_window),

        "spo2_acceleration": calculate_acceleration(
            spo2_window
        ),

        # TEMP

        "temp_mean": np.mean(temp_window),

        "temp_slope": calculate_slope(temp_window),

        "temp_acceleration": calculate_acceleration(
            temp_window
        ),

        # RESP

        "resp_mean": np.mean(resp_window),

        "resp_slope": calculate_slope(resp_window),

        "resp_acceleration": calculate_acceleration(
            resp_window
        ),

        # BLOOD PRESSURE

        "sbp_mean": np.mean(sbp_window),

        "map_mean": np.mean(map_window),

        "sbp_above_baseline": sbp_above_baseline,

        # HISTORY

        "age": history.age,

        "age_60_plus": (
            1 if history.age > 60 else 0
        ),

        "diabetes": history.diabetes,

        "smoker": history.smoker,

        "heart_disease": history.heart_disease,

        "kidney_disease": history.kidney_disease,

        "baseline_sbp": history.baseline_sbp,

        "baseline_dbp": history.baseline_dbp,

        "baseline_hr": history.baseline_hr,

        "bmi": history.bmi
    }

    # --------------------------------------
    # Return dataframe
    # --------------------------------------

    return pd.DataFrame([feature_dict])