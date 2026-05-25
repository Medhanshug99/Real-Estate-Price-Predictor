from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from app.models.property import Property

def get_recommendations(db: Session, location: str, budget: float, property_type: str, limit: int = 5) -> List[Property]:
    query = db.query(Property)
    
    if location:
        query = query.filter(
            or_(
                Property.location.ilike(f"%{location}%"),
                Property.city.ilike(f"%{location}%")
            )
        )
    if property_type:
        query = query.filter(Property.property_type.ilike(f"%{property_type}%"))
    if budget:
        min_budget = budget * 0.8
        max_budget = budget * 1.2
        query = query.filter(Property.listed_price >= min_budget, Property.listed_price <= max_budget)
    
    results = query.limit(limit * 2).all()
    
    if budget:
        results.sort(key=lambda x: abs(x.listed_price - budget))
        
    return results[:limit]
