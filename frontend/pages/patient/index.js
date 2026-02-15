import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { patientAPI, getUser } from '../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function mapStatus(status) {
  switch (status) {
    case 'PENDING':         return 'PENDING_AI';
    case 'ANALYZED':        return 'AI_ANALYZED';
    case 'READY':           return 'REPORT_READY';
    case 'VERIFIED':        return 'REPORT_VERIFIED';
    case 'PENDING_AI':      return 'PENDING_AI';
    case 'AI_ANALYZED':     return 'AI_ANALYZED';
    case 'REPORT_READY':    return 'REPORT_READY';
    case 'REPORT_VERIFIED': return 'REPORT_VERIFIED';
    default:                return status ?? 'PENDING_AI';
  }
}

function resolveStatusBadge(rawStatus) {
  const status = mapStatus(rawStatus);
  switch (status) {
    case 'PENDING_AI':      return { cls: 'badge-pending',  label: 'Pending AI' };
    case 'AI_ANALYZED':     return { cls: 'badge-analyzed', label: 'AI Analyzed' };
    case 'REPORT_READY':    return { cls: 'badge-ready',    label: 'Report Ready' };
    case 'REPORT_VERIFIED': return { cls: 'badge-verified', label: 'Verified' };
    default:                return { cls: 'badge-pending',  label: rawStatus ?? 'Unknown' };
  }
}

// ─── Toast System ─────────────────────────────────────────────────────────────

const TOAST_DURATION = 4000;

const toastStyles = {
  wrapper: {
    position: 'fixed', bottom: 24, right: 24,
    display: 'flex', flexDirection: 'column', gap: 10,
    zIndex: 9999, pointerEvents: 'none',
  },
  base: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '12px 16px', borderRadius: 'var(--radius-md)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
    minWidth: 280, maxWidth: 360,
    pointerEvents: 'all',
    animation: 'slideInToast 0.25s ease',
    border: '1px solid',
  },
  success: { background: 'var(--bg-card)', borderColor: 'rgba(0,229,160,0.35)', color: 'var(--text-primary)' },
  error:   { background: 'var(--bg-card)', borderColor: 'rgba(255,80,80,0.35)',  color: 'var(--text-primary)' },
  info:    { background: 'var(--bg-card)', borderColor: 'rgba(0,212,255,0.35)',  color: 'var(--text-primary)' },
  icon:  { flexShrink: 0, marginTop: 1 },
  body:  { flex: 1, minWidth: 0 },
  title: { fontWeight: 600, fontSize: 13.5, marginBottom: 2 },
  msg:   { fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 },
  close: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text-muted)', padding: 2, flexShrink: 0,
    display: 'flex', alignItems: 'center',
  },
};

if (typeof document !== 'undefined') {
  const id = '__toast_style__';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes slideInToast {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(s);
  }
}

function ToastIcon({ type }) {
  if (type === 'success') return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--green)" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
  if (type === 'error') return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--red)" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--cyan)" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={toastStyles.wrapper} aria-live="polite" aria-atomic="false">
      {toasts.map(t => (
        <div key={t.id} style={{ ...toastStyles.base, ...toastStyles[t.type] }} role="alert">
          <span style={toastStyles.icon}><ToastIcon type={t.type} /></span>
          <div style={toastStyles.body}>
            <div style={toastStyles.title}>{t.title}</div>
            {t.message && <div style={toastStyles.msg}>{t.message}</div>}
          </div>
          <button style={toastStyles.close} onClick={() => onDismiss(t.id)} aria-label="Dismiss notification">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback(({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => dismiss(id), TOAST_DURATION);
  }, [dismiss]);

  const toast = {
    success: (title, message) => show({ type: 'success', title, message }),
    error:   (title, message) => show({ type: 'error',   title, message }),
    info:    (title, message) => show({ type: 'info',    title, message }),
  };

  return { toasts, toast, dismiss };
}

// ─── Confidence Bar ───────────────────────────────────────────────────────────

function ConfidenceBar({ value }) {
  const pct = Math.round((value ?? 0) * 100);
  const cls = pct >= 75 ? 'confidence-high' : pct >= 50 ? 'confidence-medium' : 'confidence-low';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="confidence-bar" style={{ width: 80 }}>
        <div className={`confidence-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono" style={{ fontSize: 12 }}>{pct}%</span>
    </div>
  );
}

// ─── PDF Download Button ──────────────────────────────────────────────────────

function DownloadReportButton({ scanId, toast }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await patientAPI.downloadReport(scanId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `report_scan_${scanId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Report downloaded', `Scan #${scanId} report saved to your device.`);
    } catch (e) {
      const status = e.response?.status;
      if (status === 404) {
        toast.error(
          'Report not approved yet',
          "Your report is still awaiting admin approval. You'll receive an email once it's ready."
        );
      } else if (status === 403) {
        toast.error('Access denied', "You don't have permission to download this report.");
      } else {
        toast.error('Download failed', 'Something went wrong. Please try again shortly.');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={handleDownload}
      disabled={downloading}
      style={{ gap: 5, fontSize: 12, padding: '4px 10px' }}
      title="Download PDF report"
    >
      {downloading ? (
        <><div className="spinner" style={{ width: 12, height: 12 }} /> Saving…</>
      ) : (
        <>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          PDF
        </>
      )}
    </button>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({ user, onClose, onDone, toast }) {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [drag, setDrag]       = useState(false);
  const inputRef              = useRef();

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const pickFile = (f) => {
    if (!f) return;
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      setError('Only JPG or PNG files are allowed.');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum size is 20 MB.');
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('patient_id', user.id);
      await patientAPI.uploadScan(fd);
      setSuccess(true);
      onDone();
      toast.success('Scan uploaded', 'Your scan has been submitted for AI analysis.');
      setTimeout(() => onClose(), 1200);
    } catch (e) {
      const msg = e.response?.data?.detail || 'Upload failed. Please try again.';
      setError(msg);
      toast.error('Upload failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Upload Scan</div>
            <div className="modal-subtitle">CT, MRI or X-ray — JPG / PNG up to 20 MB</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error   && <div className="alert alert-error"   role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="status">Scan uploaded successfully! ✓</div>}

          <div
            className={`upload-area ${drag ? 'drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: 'none' }}
              onChange={(e) => pickFile(e.target.files[0])}
            />
            {preview ? (
              <img src={preview} alt="Scan preview"
                style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 'var(--radius-md)', objectFit: 'contain' }} />
            ) : (
              <>
                <div className="upload-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <polyline points="16 16 12 12 8 16"/>
                    <line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                  </svg>
                </div>
                <div className="upload-text">Drop scan image here</div>
                <div className="upload-hint">or click to browse — JPG, PNG up to 20 MB</div>
              </>
            )}
          </div>

          {file && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--cyan)" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex' }}
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                aria-label="Remove selected file"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={upload} disabled={!file || loading || success}>
            {loading  ? <><div className="spinner"/> Uploading…</> :
             success  ? <>✓ Done</> :
             <>
               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                 <polyline points="16 16 12 12 8 16"/>
                 <line x1="12" y1="12" x2="12" y2="21"/>
                 <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
               </svg>
               Upload Scan
             </>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Scan Banner (always visible between stats and latest card) ─────────

function UploadBanner({ onClick }) {
  return (
    <div style={{
      marginBottom: 20,
      padding: '14px 20px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(0,212,255,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--cyan-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="var(--cyan)" strokeWidth="2">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
            Submit a new scan
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            CT, MRI or X-ray — JPG / PNG up to 20 MB
          </div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onClick} style={{ flexShrink: 0 }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Upload Scan
      </button>
    </div>
  );
}

// ─── Main Patient Content ─────────────────────────────────────────────────────

function PatientContent() {
  const user = getUser();
  const [scans, setScans]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [fetchError, setFetchError] = useState('');
  const { toasts, toast, dismiss }  = useToast();

  const load = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await patientAPI.getStatus(user.id);
      const data = Array.isArray(res.data) ? [...res.data].reverse() : [];
      setScans(data);
    } catch (e) {
      console.error('Failed to load scans:', e);
      const msg = 'Could not load your scans. Please refresh the page.';
      setFetchError(msg);
      toast.error('Failed to load scans', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const total     = scans.length;
  const ready     = scans.filter(s => mapStatus(s.status) === 'REPORT_READY').length;
  const pending   = scans.filter(s => mapStatus(s.status) === 'PENDING_AI').length;
  const latest    = scans[0] ?? null;
  const latestPct = Math.round((latest?.confidence ?? 0) * 100);

  const hasReport = (scan) => {
    const s = mapStatus(scan.status);
    return s === 'REPORT_READY' || s === 'REPORT_VERIFIED';
  };

  return (
    <div className="layout">
      <Navbar user={user} />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {showModal && (
        <UploadModal
          user={user}
          toast={toast}
          onClose={() => setShowModal(false)}
          onDone={load}
        />
      )}

      <div className="main-content">

        {/* ── Top bar — title only, no button here ── */}
        <div className="topbar">
          <div>
            <div className="topbar-title">Patient Dashboard</div>
            <div className="topbar-subtitle">Track your scans and reports</div>
          </div>
        </div>

        <div className="page-content">

          {fetchError && (
            <div className="alert alert-error" style={{ marginBottom: 24 }} role="alert">
              {fetchError}
            </div>
          )}

          {/* ── Stats Grid ── */}
          <div className="stats-grid">
            <div className="stat-card cyan">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="10" rx="2"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                </svg>
              </div>
              <div className="stat-value">{total}</div>
              <div className="stat-label">Total Scans</div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <div className="stat-value">{ready}</div>
              <div className="stat-label">Reports Ready</div>
            </div>

            <div className="stat-card amber">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="stat-value">{pending}</div>
              <div className="stat-label">Awaiting Analysis</div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div className="stat-value">{latest ? `${latestPct}%` : '—'}</div>
              <div className="stat-label">Latest Confidence</div>
            </div>
          </div>

          {/* ── ALWAYS-VISIBLE Upload Banner ── */}
          <UploadBanner onClick={() => setShowModal(true)} />

          {/* ── Latest Result Card ── */}
          {latest && (
            <div className="card mb-6">
              <div className="card-header">
                <span className="card-title">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  Latest Scan Result
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {(() => {
                    const sb = resolveStatusBadge(latest.status);
                    return (
                      <span className={`badge ${sb.cls}`}>
                        <span className="badge-dot"/>
                        {sb.label}
                      </span>
                    );
                  })()}
                  {hasReport(latest) && <DownloadReportButton scanId={latest.id} toast={toast} />}
                </div>
              </div>

              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                  <div>
                    <div className="form-label" style={{ marginBottom: 6 }}>Scan ID</div>
                    <div className="mono" style={{ color: 'var(--cyan)' }}>#{latest.id}</div>
                  </div>
                  <div>
                    <div className="form-label" style={{ marginBottom: 6 }}>AI Prediction</div>
                    <div
                      className={`diagnosis-label ${
                        latest.prediction === 'Normal' ? 'normal' : latest.prediction ? 'abnormal' : ''
                      }`}
                      style={{ fontSize: 16 }}
                    >
                      {latest.prediction || 'Pending'}
                    </div>
                  </div>
                  <div>
                    <div className="form-label" style={{ marginBottom: 6 }}>Confidence</div>
                    <ConfidenceBar value={latest.confidence ?? 0} />
                  </div>
                </div>

                {latest.doctor_notes && (
                  <div style={{
                    marginTop: 16, padding: '12px 14px',
                    background: 'var(--cyan-dim)', borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(0,212,255,0.2)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                      Doctor Notes
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{latest.doctor_notes}</div>
                  </div>
                )}

                {latest.pharmacist_notes && (
                  <div style={{
                    marginTop: 10, padding: '12px 14px',
                    background: 'var(--green-dim)', borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(0,229,160,0.2)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                      Prescription Notes
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{latest.pharmacist_notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Scan History Table ── */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Scan History
              </span>
              <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  style={{ transition: 'transform 0.4s', ...(loading ? { transform: 'rotate(360deg)' } : {}) }}>
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                </svg>
                Refresh
              </button>
            </div>

            <div className="card-body-flush">
              <div className="table-wrap">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"/>
                    <span>Loading scans…</span>
                  </div>
                ) : scans.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="7" width="20" height="10" rx="2"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                      </svg>
                    </div>
                    <div className="empty-title">No scans yet</div>
                    <div className="empty-desc">Use the upload banner above to submit your first scan</div>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Scan ID</th>
                        <th>Status</th>
                        <th>Prediction</th>
                        <th>Confidence</th>
                        <th>Doctor Notes</th>
                        <th>Report</th>
                        <th>Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scans.map(scan => {
                        const sb = resolveStatusBadge(scan.status);
                        return (
                          <tr key={scan.id}>
                            <td><span className="mono text-cyan">#{scan.id}</span></td>
                            <td>
                              <span className={`badge ${sb.cls}`}>
                                <span className="badge-dot"/>
                                {sb.label}
                              </span>
                            </td>
                            <td>
                              {scan.prediction ? (
                                <span style={{ fontWeight: 600, color: scan.prediction === 'Normal' ? 'var(--green)' : 'var(--red)' }}>
                                  {scan.prediction}
                                </span>
                              ) : <span className="text-muted">Pending</span>}
                            </td>
                            <td>
                              {scan.confidence != null
                                ? <ConfidenceBar value={scan.confidence}/>
                                : <span className="text-muted">—</span>
                              }
                            </td>
                            <td style={{ maxWidth: 200 }} title={scan.doctor_notes || ''}>
                              {scan.doctor_notes ? (
                                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                                  {scan.doctor_notes.slice(0, 60)}{scan.doctor_notes.length > 60 ? '…' : ''}
                                </span>
                              ) : <span className="text-muted">—</span>}
                            </td>
                            <td>
                              {hasReport(scan)
                                ? <DownloadReportButton scanId={scan.id} toast={toast} />
                                : <span className="text-muted" style={{ fontSize: 12 }}>—</span>
                              }
                            </td>
                            <td><span className="text-sm text-muted">{fmt(scan.created_at)}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PatientDashboard() {
  return (
    <ProtectedRoute allowedRole="patient">
      <PatientContent />
    </ProtectedRoute>
  );
}