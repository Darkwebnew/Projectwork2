# split_lung_dataset.py
"""
Dataset Splitting Script for CSSS Project
Splits raw dataset into train/val/test with 70/15/15 ratio
Generates dataset distribution visualization
"""
import os
import shutil
from pathlib import Path
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import numpy as np

# ============================================================
# PROJECT PATHS - ADJUST IF NEEDED
# ============================================================
PROJECT_ROOT = Path(__file__).resolve().parent
RAW_DATASET_DIR = PROJECT_ROOT / "Dataset"  # Your raw dataset folder
OUTPUT_DATASET_DIR = PROJECT_ROOT / "dataset" / "lung"
TRAIN_DIR = OUTPUT_DATASET_DIR / "train"
VAL_DIR = OUTPUT_DATASET_DIR / "val"
TEST_DIR = OUTPUT_DATASET_DIR / "test"
SPLIT_RATIO = (0.7, 0.15, 0.15)  # train / val / test
RANDOM_STATE = 42  # For reproducibility

# ============================================================
# CREATE OUTPUT DIRECTORIES
# ============================================================
print("\n" + "="*60)
print("CSSS Dataset Splitting Script")
print("="*60)

for folder in [TRAIN_DIR, VAL_DIR, TEST_DIR]:
    folder.mkdir(parents=True, exist_ok=True)
    print(f"✓ Created directory: {folder}")

# ============================================================
# SPLIT FUNCTION
# ============================================================
def split_class(class_name: str):
    """Split images for a single class into train/val/test"""
    print(f"\n📂 Processing class: {class_name}")
    class_path = RAW_DATASET_DIR / class_name
    
    # Validation checks
    if not class_path.exists() or not class_path.is_dir():
        print(f"⚠️  Warning: Class folder '{class_name}' does not exist!")
        return 0, 0, 0
    
    # Get all images
    images = list(class_path.glob("*.jpg")) + list(class_path.glob("*.png")) + \
             list(class_path.glob("*.jpeg")) + list(class_path.glob("*.JPEG"))
    
    if len(images) == 0:
        print(f"⚠️  Warning: No images found for class '{class_name}'")
        return 0, 0, 0
    
    print(f"   Found {len(images)} images")

    # Split: First split train vs (val+test), then split val vs test
    train_imgs, temp_imgs = train_test_split(
        images, 
        test_size=(1 - SPLIT_RATIO[0]), 
        random_state=RANDOM_STATE
    )
    val_imgs, test_imgs = train_test_split(
        temp_imgs, 
        test_size=SPLIT_RATIO[2]/(SPLIT_RATIO[1]+SPLIT_RATIO[2]), 
        random_state=RANDOM_STATE
    )

    # Copy images to respective directories
    for split_name, split_imgs, target_dir in [
        ("train", train_imgs, TRAIN_DIR),
        ("val", val_imgs, VAL_DIR),
        ("test", test_imgs, TEST_DIR)
    ]:
        class_target = target_dir / class_name
        class_target.mkdir(parents=True, exist_ok=True)
        
        for img_path in split_imgs:
            dest = class_target / img_path.name
            if not dest.exists():
                shutil.copy(img_path, dest)
    
    print(f"   ✅ Split: Train={len(train_imgs)}, Val={len(val_imgs)}, Test={len(test_imgs)}")
    return len(train_imgs), len(val_imgs), len(test_imgs)

# ============================================================
# MAIN EXECUTION
# ============================================================
if __name__ == "__main__":
    # Detect classes
    class_names = sorted([d.name for d in RAW_DATASET_DIR.iterdir() if d.is_dir()])
    
    if not class_names:
        print("\n❌ ERROR: No class folders found in Dataset directory!")
        print(f"   Please ensure your dataset is in: {RAW_DATASET_DIR}")
        exit(1)
    
    print(f"\n🎯 Detected {len(class_names)} classes:")
    for cls in class_names:
        print(f"   • {cls}")
    
    # Split each class
    dataset_counts = {"train": [], "val": [], "test": []}
    for cls in class_names:
        t, v, te = split_class(cls)
        dataset_counts["train"].append(t)
        dataset_counts["val"].append(v)
        dataset_counts["test"].append(te)
    
    # ============================================================
    # GENERATE DATASET SPLIT VISUALIZATION
    # ============================================================
    print("\n📊 Generating dataset split visualization...")
    
    x = np.arange(len(class_names))
    width = 0.25
    
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.bar(x - width, dataset_counts["train"], width, label="Train", color='#00796b')
    ax.bar(x, dataset_counts["val"], width, label="Validation", color='#ffa726')
    ax.bar(x + width, dataset_counts["test"], width, label="Test", color='#42a5f5')
    
    ax.set_xlabel('Disease Classes', fontsize=12, fontweight='bold')
    ax.set_ylabel('Number of Images', fontsize=12, fontweight='bold')
    ax.set_title('CSSS Dataset Split Distribution (70% / 15% / 15%)', 
                 fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(class_names, rotation=45, ha='right')
    ax.legend(fontsize=10)
    ax.grid(axis='y', alpha=0.3)
    
    plt.tight_layout()
    
    # Save to artifacts/plots
    plots_dir = PROJECT_ROOT / "artifacts" / "plots"
    plots_dir.mkdir(parents=True, exist_ok=True)
    output_path = plots_dir / "dataset_split_distribution.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"   ✅ Saved to: {output_path}")
    
    # ============================================================
    # SUMMARY STATISTICS
    # ============================================================
    total_train = sum(dataset_counts["train"])
    total_val = sum(dataset_counts["val"])
    total_test = sum(dataset_counts["test"])
    total_images = total_train + total_val + total_test
    
    print("\n" + "="*60)
    print("DATASET SPLIT SUMMARY")
    print("="*60)
    print(f"Total Images:      {total_images:,}")
    print(f"Training Set:      {total_train:,} ({total_train/total_images*100:.1f}%)")
    print(f"Validation Set:    {total_val:,} ({total_val/total_images*100:.1f}%)")
    print(f"Test Set:          {total_test:,} ({total_test/total_images*100:.1f}%)")
    print("="*60)
    print("\n🎉 Dataset splitting completed successfully!\n")
