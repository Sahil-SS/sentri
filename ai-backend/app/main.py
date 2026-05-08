from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.schemas import PredictionRequest

from app.predictor import predict_risk


# ------------------------------------------
# FastAPI app
# ------------------------------------------

app = FastAPI(
    title="Sentri AI Backend"
)


# ------------------------------------------
# CORS
# ------------------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ------------------------------------------
# Health route
# ------------------------------------------

@app.get("/")
def health_check():

    return {
        "message": "Sentri AI Backend Running"
    }


# ------------------------------------------
# Prediction route
# ------------------------------------------

@app.post("/predict")
def predict(request: PredictionRequest):

    result = predict_risk(request)

    return result