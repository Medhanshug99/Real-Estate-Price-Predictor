# Real Estate Price Predictor & Recommendation Engine

A full-stack web application that predicts real estate prices and recommends properties based on user preferences. Instead of just a simple script, this is built as a complete product with a clean user interface, a modular API, and a custom machine learning pipeline.

## Features

- **Price Prediction Engine**: Users can input property details (location, sqft, bedrooms, etc.) and get an instant, ML-driven price estimate.
- **Smart Recommendations**: Suggests similar properties based on budget, location, and property type.
- **Modern Dashboard**: A responsive, clean frontend for searching properties and viewing pricing insights.
- **Automated ML Pipeline**: Includes scripts to generate data, clean it, train multiple models (Linear Regression, Random Forest, Gradient Boosting), and save the best performer.
- **Secure Backend**: Features JWT-based authentication for different user roles (buyer, seller, admin).
- **Containerized**: Fully set up with Docker and Docker Compose for easy local development and deployment.

## Skills & Technologies Used

### Frontend
- **React** (with TypeScript)
- **TailwindCSS** for styling
- **Vite** as the build tool
- **Axios** for API communication

### Backend & Machine Learning
- **Python** (FastAPI)
- **Scikit-Learn, Pandas, NumPy** for data processing and model training
- **Pydantic** for strict data validation
- **SQLAlchemy & Alembic** for database ORM and migrations

### Infrastructure
- **PostgreSQL** as the relational database
- **Docker & Docker Compose** for containerization
- **Git** for version control

## Folder Structure

- `/backend`: Contains the FastAPI application, ML pipeline (`/app/ml`), Alembic migrations, and database models.
- `/frontend`: The React TypeScript application.
- `/data`: Raw and processed CSV datasets.
- `docker-compose.yml`: Orchestrates the database, backend, and frontend containers.

## Setup Instructions

### Using Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed.
2. Run the following command in the root directory:
   ```bash
   docker compose up --build -d
   ```
3. To generate data, train the model, and seed the database, run these commands inside the backend container:
   ```bash
   docker exec -it real_estate_backend bash
   python app/ml/dataset_generator.py
   python app/ml/pipeline.py
   alembic upgrade head
   python scripts/seed.py
   ```

### Local Development (Without Docker)

1. **Database**: Start a PostgreSQL instance on port 5432 with credentials matching the `.env` file.
2. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
   pip install -r requirements.txt
   
   # Run Migrations, generate data, and train the model
   alembic upgrade head
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

## ML Workflow

1. `dataset_generator.py`: Generates a synthetic dataset with realistic correlated features.
2. `pipeline.py`: Cleans data (handles missing values, encodes categories) and trains multiple regression models. The best model is serialized as `best_model.joblib`.
3. `prediction_service.py`: The FastAPI backend loads this model into memory to serve fast, real-time predictions to the frontend.

## License

