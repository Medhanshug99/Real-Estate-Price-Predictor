import os
import sys
import pandas as pd
from sqlalchemy.orm import Session

# Add the parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal, engine
from app.models.property import Property
from app.models.user import User
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # Create admin user
        admin = db.query(User).filter(User.email == "admin@proppredict.com").first()
        if not admin:
            admin = User(
                name="Admin",
                email="admin@proppredict.com",
                password_hash=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("Admin user created.")

        # Seed properties
        data_path = os.path.join(os.path.dirname(__file__), "../../data/raw/real_estate_data.csv")
        if not os.path.exists(data_path):
            print("Data file not found. Please run dataset_generator.py first.")
            return

        # Check if already seeded
        if db.query(Property).count() > 0:
            print("Properties already seeded.")
            return

        df = pd.read_csv(data_path).head(100) # Seed first 100
        for _, row in df.iterrows():
            prop = Property(
                title=row['title'],
                location=row['location'],
                city=row['city'],
                locality=row['locality'],
                property_type=row['property_type'],
                area_sqft=row['area_sqft'],
                bedrooms=row['bedrooms'],
                bathrooms=row['bathrooms'],
                furnishing_status=row['furnishing_status'],
                property_age=row['property_age'],
                amenities=row['amenities'],
                description=row['description'],
                listed_price=row['listed_price']
            )
            db.add(prop)
        db.commit()
        print("Seeded properties successfully.")
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
