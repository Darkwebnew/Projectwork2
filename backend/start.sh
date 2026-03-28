#!/bin/bash
# Install dependencies
pip install -r backend/requirements.txt

# Start FastAPI
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
