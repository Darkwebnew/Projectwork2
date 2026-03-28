#!/bin/bash

# Upgrade pip
python3 -m pip install --upgrade pip

# Install dependencies
python3 -m pip install -r backend/requirements.txt

# Start FastAPI app
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
