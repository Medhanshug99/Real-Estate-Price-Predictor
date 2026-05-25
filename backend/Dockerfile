FROM python:3.11-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data needed for the NLP pipeline
RUN python -m nltk.downloader punkt stopwords

COPY . .

# Ensure entrypoint is executable
RUN chmod +x entrypoint.sh

ENTRYPOINT ["sh", "entrypoint.sh"]
