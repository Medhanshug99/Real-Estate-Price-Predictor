import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import logging
import json
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

def extract_nlp_features(df):
    """Lightweight NLP feature extraction from descriptions."""
    keywords = ["pool", "parking", "garden", "renovated", "furnished", "luxury"]
    if "description" not in df.columns:
        for word in keywords:
            df[f"has_{word}"] = 0
        return df

    for word in keywords:
        df[f"has_{word}"] = df["description"].str.lower().str.contains(word).fillna(False).astype(int)
    return df

def preprocess_data(data_path: str):
    logger.info(f"Loading data from {data_path}")
    df = pd.read_csv(data_path)
    
    # Clean data
    df = df.drop_duplicates()
    
    # Missing values
    if "amenities" in df.columns:
        df["amenities"] = df["amenities"].fillna("")
    if "description" in df.columns:
        df["description"] = df["description"].fillna("")
    df = df.dropna(subset=["listed_price", "area_sqft", "bedrooms"])
    
    # Feature Engineering
    df = extract_nlp_features(df)
    
    # Select features
    nlp_cols = [f"has_{w}" for w in ["pool", "parking", "garden", "renovated", "furnished", "luxury"]]
    categorical_features = ["city", "property_type", "furnishing_status", "property_age"]
    numerical_features = ["area_sqft", "bedrooms", "bathrooms"] + nlp_cols
    
    X = df[categorical_features + numerical_features]
    y = df["listed_price"]
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return X, y, preprocessor

def train_and_evaluate(data_path: str):
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    X, y, preprocessor = preprocess_data(data_path)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42)
    }
    
    best_model = None
    best_score = -float('inf')
    best_name = ""
    results = {}
    
    for name, model in models.items():
        logger.info(f"Training {name}...")
        pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                   ('model', model)])
        
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        
        r2 = float(r2_score(y_test, y_pred))
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        
        results[name] = {"R2": r2, "MAE": mae, "RMSE": rmse}
        logger.info(f"{name} - R2: {r2:.4f}, MAE: {mae:.2f}, RMSE: {rmse:.2f}")
        
        if r2 > best_score:
            best_score = r2
            best_model = pipeline
            best_name = name
            
    logger.info(f"Best Model: {best_name} with R2: {best_score:.4f}")
    
    # Save artifacts
    model_path = os.path.join(ARTIFACTS_DIR, "best_model.joblib")
    joblib.dump(best_model, model_path)
    
    metrics = {
        "best_model": best_name,
        "timestamp": datetime.now().isoformat(),
        "metrics": results,
        "features": {
            "categorical": ["city", "property_type", "furnishing_status", "property_age"],
            "numerical": ["area_sqft", "bedrooms", "bathrooms"] + [f"has_{w}" for w in ["pool", "parking", "garden", "renovated", "furnished", "luxury"]]
        }
    }
    metrics_path = os.path.join(ARTIFACTS_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=4)
        
    logger.info(f"Saved artifacts to {ARTIFACTS_DIR}")
    return results

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "../../../data/raw/real_estate_data.csv")
    train_and_evaluate(data_path)
