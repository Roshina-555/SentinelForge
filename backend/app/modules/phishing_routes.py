from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.phishing_engine import predict_phishing

router = APIRouter(
    prefix="/api/phishing",
    tags=["AI Phishing Detection"]
)

class PhishingRequest(BaseModel):
    message: str

@router.post("/predict")
def phishing_prediction(request: PhishingRequest):
    return predict_phishing(request.message)