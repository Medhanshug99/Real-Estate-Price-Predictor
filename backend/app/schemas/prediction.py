from pydantic import BaseModel

class PredictionRequest(BaseModel):
    location: str
    area_sqft: float
    bedrooms: int
    bathrooms: int
    property_type: str
    furnishing_status: str
    property_age: str
    amenities: str = ""
    description: str = ""

class PredictionResponse(BaseModel):
    predicted_price: float
    currency: str = "INR"
