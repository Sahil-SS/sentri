import numpy as np

# ------------------------------------------
# Calculate slope
# ------------------------------------------

def calculate_slope(values):

    x = np.arange(len(values))

    slope = np.polyfit(x, values, 1)[0]

    return slope


# ------------------------------------------
# Calculate acceleration
# ------------------------------------------

def calculate_acceleration(values):

    slopes = np.diff(values)

    if len(slopes) < 2:
        return 0

    acceleration = np.mean(
        np.diff(slopes)
    )

    return acceleration