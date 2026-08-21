#!/bin/bash
set -e

cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start FastAPI with Uvicorn
uvicorn main:app --host 0.0.0.0 --port $PORT

