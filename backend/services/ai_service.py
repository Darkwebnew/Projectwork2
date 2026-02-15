import os
import json
import tensorflow as tf
import numpy as np
import cv2
from dotenv import load_dotenv

load_dotenv()

# ── Paths ─────────────────────────────────────────────
MODEL_PATH   = os.getenv("AI_MODEL_PATH", "models/lung_model.h5")
LABELS_PATH  = os.getenv("CLASS_LABELS_PATH", "models/metadata/class_labels.json")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.75"))

# ── Validate files ────────────────────────────────────
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"AI model not found at: {MODEL_PATH}")

if not os.path.exists(LABELS_PATH):
    raise FileNotFoundError(f"Class labels file not found at: {LABELS_PATH}")

# ── Load class labels ─────────────────────────────────
with open(LABELS_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

# ── Load model ────────────────────────────────────────
model = tf.keras.models.load_model(MODEL_PATH)

# 🔥 AUTO-DETECT INPUT SIZE FROM MODEL
MODEL_INPUT_SHAPE = model.input_shape
IMG_HEIGHT = MODEL_INPUT_SHAPE[1]
IMG_WIDTH  = MODEL_INPUT_SHAPE[2]
IMG_CHANNELS = MODEL_INPUT_SHAPE[3]

print(f"[AI] Model loaded successfully")
print(f"[AI] Expected input size: {IMG_HEIGHT}x{IMG_WIDTH}x{IMG_CHANNELS}")


# ──────────────────────────────────────────────────────
def predict_scan(image_path: str) -> dict:

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at: {image_path}")

    # ── Load image ─────────────────────────────────────
    img = cv2.imread(image_path, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError(f"OpenCV cannot read image: {image_path}")

    # ── Convert BGR → RGB ─────────────────────────────
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # ── Resize to MODEL REQUIRED SIZE (NOT HARDCODED) ─
    img = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))

    # ── Normalize ─────────────────────────────────────
    img = img.astype("float32") / 255.0

    # ── Add batch dimension ───────────────────────────
    img = np.expand_dims(img, axis=0)

    # ── Predict ───────────────────────────────────────
    try:
        predictions = model.predict(img, verbose=0)
    except Exception as e:
        raise ValueError(f"Model prediction failed: {str(e)}")

    if predictions is None or len(predictions) == 0:
        raise ValueError("Model returned empty predictions")

    confidence  = float(np.max(predictions))
    class_index = int(np.argmax(predictions))

    if class_index >= len(CLASS_NAMES):
        raise ValueError(
            f"Predicted class index {class_index} exceeds class labels ({len(CLASS_NAMES)})"
        )

    label = CLASS_NAMES[class_index]

    if confidence < CONFIDENCE_THRESHOLD:
        label = "Uncertain"

    all_predictions = {
        CLASS_NAMES[i]: float(predictions[0][i])
        for i in range(len(CLASS_NAMES))
    }

    return {
        "label": label,
        "confidence": confidence,
        "class_index": class_index,
        "all_predictions": all_predictions,
        "threshold_used": CONFIDENCE_THRESHOLD,
        "model_input_size": f"{IMG_HEIGHT}x{IMG_WIDTH}x{IMG_CHANNELS}"
    }
