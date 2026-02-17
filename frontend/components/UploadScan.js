# frontend/components/UploadScan.js

import { useState, useRef, useEffect } from 'react';
import { patientAPI } from '../services/api';

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/webp'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function UploadScan({ patientId, onUploaded }) {
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  // ─── Cleanup object URL on unmount to prevent memory leaks ───────────────
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ─── File validation & preview setup ─────────────────────────────────────
  const handleFile = (f) => {
    if (!f) return;

    const type = f.type.toLowerCase();
    if (!ALLOWED.includes(type)) {
      setError('Only JPG, PNG, BMP, or WebP images are supported.');
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError('');
    setFile(f);

    // Revoke previous URL before creating a new one
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  };

  // ─── Upload handler with real-time progress ───────────────────────────────
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('patient_id', patientId);

      const res = await patientAPI.uploadScan(fd, {
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      });

      setProgress(100);

      setTimeout(() => {
        URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
        setProgress(0);
        onUploaded?.(res.data);
      }, 600);

    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ─── Clear / reset state ──────────────────────────────────────────────────
  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError('');
    setProgress(0);
  };

  // ─── Drag & drop handlers ─────────────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only clear dragOver if leaving the zone itself (not a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ─── Keyboard accessibility for drop zone ─────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileRef.current?.click();
    }
  };

  // ─── Format file size ─────────────────────────────────────────────────────
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>

      {/* Error banner */}
      {error && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}

      {!preview ? (
        /* ── Drop zone ── */
        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Upload scan: click or drag and drop an image file here"
        >
          {/* Hidden file input — triggered by click on zone */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
            aria-hidden="true"
            tabIndex={-1}
          />

          <div className="upload-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>

          <div className="upload-title">Drop your scan here</div>
          <div className="upload-subtitle">
            CT, MRI, X-Ray — JPG, PNG, BMP or WebP, max {MAX_SIZE_MB}MB
          </div>
        </div>

      ) : (
        /* ── Preview + upload controls ── */
        <div>

          {/* Image preview */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <img
              src={preview}
              alt={`Preview of scan for patient ${patientId}`}
              style={{
                width: '100%',
                maxHeight: 220,
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
              }}
            />
            <button
              onClick={clear}
              disabled={uploading}
              aria-label="Remove selected scan"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 26,
                height: 26,
                border: 'none',
                background: 'rgba(0,0,0,0.7)',
                borderRadius: '50%',
                color: '#fc8181',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* File info row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2" aria-hidden="true">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {file.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {formatSize(file.size)}
            </span>
          </div>

          {/* Upload progress bar */}
          {progress > 0 && (
            <div
              className="upload-progress"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Upload progress: ${progress}%`}
              style={{ marginBottom: 12 }}
            >
              <div
                className="upload-progress-fill"
                style={{ width: `${progress}%`, transition: 'width 0.2s ease' }}
              />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
              aria-busy={uploading}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {uploading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Uploading… {progress > 0 && `${progress}%`}
                </>
              ) : (
                '↑ Submit Scan'
              )}
            </button>

            <button
              className="btn btn-ghost"
              onClick={clear}
              disabled={uploading}
              aria-label="Cancel and remove selected file"
            >
              Cancel
            </button>
          </div>

        </div>
      )}
    </div>
  );
}