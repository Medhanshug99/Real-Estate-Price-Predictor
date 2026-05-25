from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.models.base import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    location = Column(String, index=True, nullable=False)
    city = Column(String, index=True, nullable=False)
    locality = Column(String, index=True, nullable=False)
    property_type = Column(String, index=True, nullable=False)
    area_sqft = Column(Float, nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    furnishing_status = Column(String, nullable=False)
    property_age = Column(String, nullable=False)
    amenities = Column(String, nullable=True)
    description = Column(String, nullable=True)
    listed_price = Column(Float, nullable=False)
    predicted_price = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
