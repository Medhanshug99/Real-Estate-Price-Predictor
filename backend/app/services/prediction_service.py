import os
import joblib
import pandas as pd
import logging
from app.schemas.prediction import PredictionRequest
from app.ml.pipeline import extract_nlp_features, ARTIFACTS_DIR

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        model_path = os.path.join(ARTIFACTS_DIR, "best_model.joblib")
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            logger.info("Loaded ML model successfully.")
        else:
            logger.warning("ML model not found. Predictions will fail.")

    def predict(self, request: PredictionRequest) -> float:
        if not self.model:
            self._load_model()
            if not self.model:
                raise ValueError("Model is not available.")
        
        # Convert request to dataframe
        city = request.location.split(" ")[0] if " " in request.location else request.location
        data = {
            "city": [city],
            "property_type": [request.property_type],
            "furnishing_status": [request.furnishing_status],
            "property_age": [request.property_age],
            "area_sqft": [request.area_sqft],
            "bedrooms": [request.bedrooms],
            "bathrooms": [request.bathrooms],
            "amenities": [request.amenities],
            "description": [request.description]
        }
        df = pd.DataFrame(data)
        df = extract_nlp_features(df)
        
        import time
        start = time.perf_counter()
        prediction = self.model.predict(df)[0]
        duration = time.perf_counter() - start
        logger.info(f"Prediction computed in {duration:.3f}s")
        return float(prediction)

prediction_service = PredictionService()
