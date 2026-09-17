from fastapi import Depends, FastAPI
from .auth import verify_api_key
from .model import train_and_predict
from .schemas import PredictRequest, PredictResponse

app = FastAPI(title="solace-ml", version="0.1.0")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "solace-ml"}


@app.post("/predict", response_model=PredictResponse, dependencies=[Depends(verify_api_key)])
def predict(body: PredictRequest) -> PredictResponse:
    return train_and_predict(body.checkins)
