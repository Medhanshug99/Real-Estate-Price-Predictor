# Real Estate Price Prediction & Property Recommendation System

A modern, **full-stack machine learning application** for predicting real estate prices and recommending properties based on user preferences. Built with a robust architecture following professional engineering standards.

## Architecture Overview

- **Frontend**: React + TypeScript + Vite + TailwindCSS.
- **Backend**: FastAPI + Python. Follows a modular, service-oriented architecture with dependency injection and Pydantic validation.
- **Machine Learning**: Scikit-Learn pipeline using Random Forest Regressor, with an automated training script and joblib serialization.
- **Database**: PostgreSQL with SQLAlchemy ORM and Alembic for migrations.
- **Deployment**: Fully containerized using Docker and Docker Compose.

## Folder Structure

- `/backend`: FastAPI application, ML pipeline, Alembic migrations, DB models.
- `/frontend`: React TypeScript frontend.
- `/data`: Raw generated CSV datasets.
- `docker-compose.yml`: Orchestrates DB, backend, and frontend containers.

## Setup Instructions

### Local Development (Without Docker)

1. **Database Setup**: Start a PostgreSQL instance on port 5432 with credentials matching `.env`.
2. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   pip install -r requirements.txt
   
   # Run Migrations
   alembic upgrade head
   
   # Seed Data and Train ML
   python app/ml/dataset_generator.py
   python app/ml/pipeline.py
   python scripts/seed.py
   
   # Start Server
   uvicorn app.main:app --reload
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run dev
   ```

### Docker Setup

```bash
# Start all services
docker compose up --build -d

# Inside the backend container, generate data, train ML, and seed the DB
docker exec -it real_estate_backend bash
python app/ml/dataset_generator.py
python app/ml/pipeline.py
alembic upgrade head
python scripts/seed.py
```

## ML Workflow

1. `dataset_generator.py`: Generates a highly realistic synthetic dataset with correlated numerical features and location multipliers.
2. `pipeline.py`: Imputes missing values, encodes categorical variables, and performs lightweight keyword extraction using NLP. Evaluates multiple algorithms (Linear Regression, Random Forest, Gradient Boosting) and saves the best model (`best_model.joblib`) to `backend/app/ml/artifacts/`.
3. `prediction_service.py`: Dynamically loads the artifact at runtime to provide instant inferences.

## Future Improvements

- Add OAuth social login.
- Implement collaborative filtering for recommendations.
- Enhance the NLP extraction utilizing Transformer models.
