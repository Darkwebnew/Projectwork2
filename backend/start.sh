#!/bin/bash
python3 -m pip install --upgrade pip
python3 -m pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
