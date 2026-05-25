from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PropertyBase(BaseModel):
    title: str
    location: str
    city: str
    locality: str
    property_type: str
    area_sqft: float
    bedrooms: int
    bathrooms: int
    furnishing_status: str
    property_age: str
    amenities: Optional[str] = None
    description: Optional[str] = None
    listed_price: float

class PropertyCreate(PropertyBase):
    pass

class PropertyOut(PropertyBase):
    id: int
    predicted_price: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
