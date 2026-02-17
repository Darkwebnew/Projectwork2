# backend/config.py

from pathlib import Path

# Path(__file__) = backend/config.py
# .parent        = backend/
# .parent.parent = PROJECT ROOT (CLINICAL-SCAN-SUPPORT-SYSTEM/)
BASE_DIR   = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads" / "patient_scans"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)