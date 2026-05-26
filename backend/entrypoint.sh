#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
until python -c "
import psycopg2, os, sys
try:
    psycopg2.connect(os.environ['DATABASE_URL'])
    print('✅ Database is ready.')
except Exception as e:
    print(f'   Not ready: {e}')
    sys.exit(1)
"; do
  sleep 2
done

echo "⬆️  Running Alembic migrations..."
alembic upgrade head

echo "🔢 Skipping dataset generation for Render..."
# if [ ! -f "data/raw/real_estate_data.csv" ] && [ ! -f "../data/raw/real_estate_data.csv" ]; then
#   python app/ml/dataset_generator.py
# else
#   echo "   Dataset already exists, skipping generation."
# fi

echo "🤖 Skipping ML model training for Render..."
# if [ ! -f "app/ml/artifacts/best_model.joblib" ]; then
#   python app/ml/pipeline.py
# else
#   echo "   Model already exists, skipping training."
# fi

echo "🌱 Skipping database seeding (already seeded)..."
# python scripts/seed.py

echo "🚀 Starting FastAPI server..."
PORT=${PORT:-8000}
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
