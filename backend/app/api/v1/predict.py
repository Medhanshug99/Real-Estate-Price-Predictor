from fastapi import APIRouter
from typing import Any
from app.schemas.response import StandardResponse
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import prediction_service

router = APIRouter()

@router.post("/", response_model=StandardResponse)
def predict_price(
    request: PredictionRequest
) -> Any:
    """
    Predict price for a property.
    """
    try:
        price = prediction_service.predict(request)
        return StandardResponse(
            success=True,
            message="Prediction successful",
            data=PredictionResponse(predicted_price=price, currency="INR").model_dump()
        )
    except Exception as e:
        return StandardResponse(
            success=False,
            message="Prediction failed",
            errors=[str(e)]
        )
