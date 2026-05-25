import pandas as pd
import numpy as np
import os
import random

def generate_dataset(num_samples: int = 2000, output_path: str = "../../data/raw/real_estate_data.csv"):
    np.random.seed(42)
    random.seed(42)

    locations = ["Hyderabad", "Bangalore", "Mumbai", "Pune", "Chennai"]
    property_types = ["Apartment", "Villa", "Independent House", "Studio"]
    furnishing_statuses = ["Unfurnished", "Semi-Furnished", "Fully Furnished"]

    data = []
    for _ in range(num_samples):
        city = random.choice(locations)
        location = f"{city} {random.choice(['West', 'East', 'North', 'South'])}"
        locality = f"{city} Sector {random.randint(1, 15)}"
        prop_type = random.choice(property_types)
        
        # Realistic correlations
        bedrooms = random.choices([1, 2, 3, 4, 5], weights=[10, 40, 30, 15, 5])[0]
        if prop_type == "Studio":
            bedrooms = 1
        
        area_sqft = bedrooms * np.random.normal(500, 100)
        area_sqft = max(300, min(6000, area_sqft))
        
        bathrooms = max(1, bedrooms - random.choice([0, 1]))
        furnishing = random.choice(furnishing_statuses)
        age = random.choices(["0-1", "1-5", "5-10", "10+"], weights=[20, 40, 30, 10])[0]
        
        # Amenities based on type
        possible_amenities = ["pool", "parking", "garden", "gym", "security"]
        num_amenities = random.randint(1, 5)
        amenities = ", ".join(random.sample(possible_amenities, num_amenities))
        
        # Description
        desc_keywords = []
        if "pool" in amenities: desc_keywords.append("luxurious pool")
        if age == "0-1": desc_keywords.append("newly renovated")
        if furnishing == "Fully Furnished": desc_keywords.append("luxury furnished")
        description = f"A beautiful {prop_type} located in {locality}. " + " ".join(desc_keywords)

        # Base price per sqft depends on city
        base_price_sqft = {"Mumbai": 15000, "Bangalore": 8000, "Hyderabad": 6000, "Pune": 7000, "Chennai": 5500}
        price_sqft = base_price_sqft[city] * np.random.normal(1.0, 0.2)
        
        # Price adjustments
        if furnishing == "Fully Furnished": price_sqft *= 1.2
        if "pool" in amenities: price_sqft *= 1.1
        if age == "10+": price_sqft *= 0.8
        
        listed_price = area_sqft * price_sqft
        
        # Add some noise
        listed_price = listed_price * np.random.normal(1.0, 0.05)
        
        data.append({
            "title": f"{bedrooms} BHK {prop_type} in {locality}",
            "location": location,
            "city": city,
            "locality": locality,
            "property_type": prop_type,
            "area_sqft": round(area_sqft, 2),
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "furnishing_status": furnishing,
            "property_age": age,
            "amenities": amenities,
            "description": description,
            "listed_price": round(listed_price, 2)
        })

    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {num_samples} samples and saved to {output_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, "../../../data/raw/real_estate_data.csv")
    generate_dataset(output_path=output_path)
