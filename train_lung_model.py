# train_lung_model.py
"""
MobileNetV2 Training Script for CSSS Project
Trains model and generates all visualization artifacts:
- Training curves
- Confusion matrix
- Grad-CAM visualizations
- Performance metrics
"""
import json
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import cv2

# Suppress TensorFlow warnings
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# ============================================================
# PROJECT PATHS
# ============================================================
PROJECT_ROOT = Path(__file__).resolve().parent
DATASET_DIR = PROJECT_ROOT / "dataset" / "lung"
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"
MODEL_DIR = ARTIFACTS_DIR / "models"
META_DIR = ARTIFACTS_DIR / "metadata"
METRIC_DIR = ARTIFACTS_DIR / "metrics"
PLOT_DIR = ARTIFACTS_DIR / "plots"

# Create directories
for folder in [MODEL_DIR, META_DIR, METRIC_DIR, PLOT_DIR]:
    folder.mkdir(parents=True, exist_ok=True)

TRAIN_DIR = DATASET_DIR / "train"
VAL_DIR = DATASET_DIR / "val"
TEST_DIR = DATASET_DIR / "test"

MODEL_PATH = MODEL_DIR / "lung_model_final.h5"
BEST_MODEL_PATH = MODEL_DIR / "lung_model_best.h5"

# ============================================================
# HYPERPARAMETERS
# ============================================================
IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 15
LEARNING_RATE = 1e-4

print("\n" + "="*60)
print("CSSS MODEL TRAINING SCRIPT")
print("="*60)
print(f"Image Size: {IMG_SIZE}")
print(f"Batch Size: {BATCH_SIZE}")
print(f"Epochs: {EPOCHS}")
print(f"Learning Rate: {LEARNING_RATE}")
print("="*60 + "\n")

# ============================================================
# DATA GENERATORS
# ============================================================
print("📁 Loading data generators...")

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

train_data = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=True
)

val_data = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

test_data = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=1,
    class_mode='categorical',
    shuffle=False
)

CLASS_NAMES = list(train_data.class_indices.keys())
NUM_CLASSES = len(CLASS_NAMES)

print(f"✓ Classes detected: {CLASS_NAMES}")
print(f"✓ Number of classes: {NUM_CLASSES}")
print(f"✓ Training samples: {train_data.samples}")
print(f"✓ Validation samples: {val_data.samples}")
print(f"✓ Test samples: {test_data.samples}\n")

# Save class labels
with open(META_DIR / "class_labels.json", "w") as f:
    json.dump(CLASS_NAMES, f, indent=4)

# ============================================================
# MODEL ARCHITECTURE
# ============================================================
print("🏗️  Building MobileNetV2 model...")

base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)
base_model.trainable = False  # Freeze base model

# Custom classification head
inputs = base_model.input
x = base_model.output
x = GlobalAveragePooling2D(name='global_avg_pool')(x)
x = Dense(256, activation='relu', name='dense_256')(x)
x = Dropout(0.4, name='dropout')(x)
outputs = Dense(NUM_CLASSES, activation='softmax', name='predictions')(x)

model = Model(inputs=inputs, outputs=outputs, name='CSSS_MobileNetV2')

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print(f"✓ Model compiled successfully")
print(f"✓ Total parameters: {model.count_params():,}")
print(f"✓ Trainable parameters: {sum([tf.size(w).numpy() for w in model.trainable_weights]):,}\n")

# ============================================================
# CALLBACKS
# ============================================================
callbacks = [
    EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    ),
    ModelCheckpoint(
        BEST_MODEL_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    ),
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-7,
        verbose=1
    )
]

# ============================================================
# TRAIN MODEL
# ============================================================
print("🚀 Starting training...\n")

history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS,
    callbacks=callbacks,
    verbose=1
)

# Save final model
model.save(MODEL_PATH)
print(f"\n✓ Final model saved to: {MODEL_PATH}")
print(f"✓ Best model saved to: {BEST_MODEL_PATH}\n")

# ============================================================
# TRAINING CURVES
# ============================================================
print("📊 Generating training curves...")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Accuracy plot
ax1.plot(history.history['accuracy'], label='Training Accuracy', marker='o', color='#00796b')
ax1.plot(history.history['val_accuracy'], label='Validation Accuracy', marker='s', color='#ffa726')
ax1.set_title('Model Accuracy', fontsize=14, fontweight='bold')
ax1.set_xlabel('Epoch', fontsize=12)
ax1.set_ylabel('Accuracy', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

# Loss plot
ax2.plot(history.history['loss'], label='Training Loss', marker='o', color='#00796b')
ax2.plot(history.history['val_loss'], label='Validation Loss', marker='s', color='#ffa726')
ax2.set_title('Model Loss', fontsize=14, fontweight='bold')
ax2.set_xlabel('Epoch', fontsize=12)
ax2.set_ylabel('Loss', fontsize=12)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig(PLOT_DIR / "training_curves.png", dpi=300, bbox_inches='tight')
plt.close()

print(f"   ✓ Saved to: {PLOT_DIR}/training_curves.png")

# ============================================================
# MODEL EVALUATION
# ============================================================
print("\n🧪 Evaluating model on test set...")

test_loss, test_acc = model.evaluate(test_data, verbose=0)
print(f"   Test Accuracy: {test_acc*100:.2f}%")
print(f"   Test Loss: {test_loss:.4f}")

# ============================================================
# CONFUSION MATRIX
# ============================================================
print("\n📊 Generating confusion matrix...")

y_true = test_data.classes
y_pred_probs = model.predict(test_data, verbose=0)
y_pred = np.argmax(y_pred_probs, axis=1)

cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(10, 8))
sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    cmap='Blues',
    xticklabels=CLASS_NAMES,
    yticklabels=CLASS_NAMES,
    cbar_kws={'label': 'Count'}
)
plt.title('Confusion Matrix - Test Set', fontsize=14, fontweight='bold')
plt.xlabel('Predicted Label', fontsize=12)
plt.ylabel('True Label', fontsize=12)
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig(PLOT_DIR / "confusion_matrix.png", dpi=300, bbox_inches='tight')
plt.close()

print(f"   ✓ Saved to: {PLOT_DIR}/confusion_matrix.png")

# ============================================================
# CLASSIFICATION REPORT
# ============================================================
print("\n📋 Generating classification report...")

report = classification_report(
    y_true,
    y_pred,
    target_names=CLASS_NAMES,
    output_dict=True
)

with open(METRIC_DIR / "classification_report.json", "w") as f:
    json.dump(report, f, indent=4)

print(f"   ✓ Saved to: {METRIC_DIR}/classification_report.json")

# Print summary
print("\n" + "="*60)
print("PERFORMANCE SUMMARY")
print("="*60)
for class_name in CLASS_NAMES:
    metrics = report[class_name]
    print(f"{class_name:20s} → Precision: {metrics['precision']:.3f}, "
          f"Recall: {metrics['recall']:.3f}, F1: {metrics['f1-score']:.3f}")
print("="*60)

# ============================================================
# GRAD-CAM VISUALIZATIONS
# ============================================================
print("\n🔍 Generating Grad-CAM visualizations...")

def generate_gradcam(img_array, model, last_conv_layer='Conv_1'):
    """Generate Grad-CAM heatmap"""
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer).output, model.output]
    )
    
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        pred_index = tf.argmax(predictions[0])
        class_channel = predictions[:, pred_index]
    
    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    
    return heatmap.numpy()

def overlay_heatmap(img, heatmap, alpha=0.4):
    """Overlay heatmap on image"""
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    superimposed = heatmap * alpha + img * 255
    return np.uint8(superimposed)

# Find misclassified samples
misclassified_idx = np.where(y_true != y_pred)[0][:9]

if len(misclassified_idx) > 0:
    fig, axes = plt.subplots(3, 3, figsize=(12, 12))
    fig.suptitle('Grad-CAM: Misclassified Samples', fontsize=16, fontweight='bold')
    
    for i, idx in enumerate(misclassified_idx):
        img, _ = test_data[idx]
        heatmap = generate_gradcam(img, model)
        overlay = overlay_heatmap(img[0], heatmap)
        
        ax = axes[i // 3, i % 3]
        ax.imshow(overlay)
        ax.set_title(f'True: {CLASS_NAMES[y_true[idx]]}\nPred: {CLASS_NAMES[y_pred[idx]]}',
                    fontsize=10)
        ax.axis('off')
    
    plt.tight_layout()
    plt.savefig(PLOT_DIR / "gradcam_misclassified.png", dpi=300, bbox_inches='tight')
    plt.close()
    print(f"   ✓ Saved misclassified Grad-CAM to: {PLOT_DIR}/gradcam_misclassified.png")

# Find correctly classified samples
correct_idx = np.where(y_true == y_pred)[0][:9]

fig, axes = plt.subplots(3, 3, figsize=(12, 12))
fig.suptitle('Grad-CAM: Correctly Classified Samples', fontsize=16, fontweight='bold')

for i, idx in enumerate(correct_idx):
    img, _ = test_data[idx]
    heatmap = generate_gradcam(img, model)
    overlay = overlay_heatmap(img[0], heatmap)
    
    ax = axes[i // 3, i % 3]
    ax.imshow(overlay)
    ax.set_title(f'Class: {CLASS_NAMES[y_true[idx]]}\nConf: {y_pred_probs[idx][y_pred[idx]]:.2%}',
                fontsize=10)
    ax.axis('off')

plt.tight_layout()
plt.savefig(PLOT_DIR / "gradcam_correct.png", dpi=300, bbox_inches='tight')
plt.close()
print(f"   ✓ Saved correct Grad-CAM to: {PLOT_DIR}/gradcam_correct.png")

# ============================================================
# FINAL SUMMARY
# ============================================================
print("\n" + "="*60)
print("🎉 TRAINING PIPELINE COMPLETED SUCCESSFULLY!")
print("="*60)
print("\nGenerated Artifacts:")
print(f"  📁 Models:")
print(f"     • {MODEL_PATH.name}")
print(f"     • {BEST_MODEL_PATH.name}")
print(f"  📊 Visualizations:")
print(f"     • training_curves.png")
print(f"     • confusion_matrix.png")
print(f"     • gradcam_misclassified.png")
print(f"     • gradcam_correct.png")
print(f"  📈 Metrics:")
print(f"     • classification_report.json")
print(f"     • class_labels.json")
print("="*60 + "\n")
