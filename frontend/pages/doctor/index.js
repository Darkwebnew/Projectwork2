import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { doctorAPI, getUser, getStatusBadge } from '../../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function mapStatus(status) {
  switch (status) {
    case 'PENDING':  return 'PENDING_AI';
    case 'ANALYZED': return 'AI_ANALYZED';
    case 'VERIFIED': return 'DOCTOR_VERIFIED';
    default:         return status;
  }
}

// Safely extract a human-readable string from any FastAPI error shape
function extractDetail(detail) {
  if (!detail) return null;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))      return detail[0]?.msg || JSON.stringify(detail[0]);
  if (typeof detail === 'object') return detail.msg || JSON.stringify(detail);
  return String(detail);
}

// ─── ConfidenceBar ───────────────────────────────────────────────────────────

function ConfidenceBar({ value }) {
  const pct = Math.round((value || 0) * 100);
  const cls = pct >= 75 ? 'confidence-high'
            : pct >= 50 ? 'confidence-medium'
            :             'confidence-low';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="confidence-bar" style={{ width: 80 }}>
        <div className={`confidence-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono" style={{ fontSize: 12 }}>{pct}%</span>
    </div>
  );
}

// ─── VerifyModal ─────────────────────────────────────────────────────────────

function VerifyModal({ scan, onClose, onDone }) {
  const [notes, setNotes]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const predictionColor =
    scan.prediction === 'Normal' ? 'var(--green)'
    : scan.prediction            ? 'var(--red)'
    :                              'var(--text-muted)';

  const submit = async () => {
    const cleanNotes = notes.trim();
    if (!cleanNotes) { setError('Clinical notes are required.'); return; }

    setLoading(true);
    setError('');

    try {
      // ── Build FormData explicitly so FastAPI Form(...) always receives it ──
      // This guarantees Content-Type: multipart/form-data with the correct field name.
      const formData = new FormData();
      formData.append('notes', cleanNotes);

      await doctorAPI.verify(scan.id, formData);

      onDone();
      onClose();
    } catch (e) {
      const detail = e.response?.data?.detail;
      setError(extractDetail(detail) || 'Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Verify Scan #{scan.id}</div>
            <div className="modal-subtitle">Add your clinical assessment and notes</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 18,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div className="form-label" style={{ marginBottom: 4 }}>AI Prediction</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: predictionColor }}>
                  {scan.prediction || '—'}
                </div>
              </div>
              <div>
                <div className="form-label" style={{ marginBottom: 4 }}>Confidence</div>
                {scan.confidence != null
                  ? <ConfidenceBar value={scan.confidence} />
                  : <span className="text-muted">—</span>}
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="form-label" style={{ marginBottom: 4 }}>File Path</div>
              <div className="font-mono text-sm text-muted" style={{ wordBreak: 'break-all' }}>
                {scan.file_path || '—'}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Clinical Notes <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe your clinical assessment, findings, and recommendations..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ minHeight: 110 }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={submit} disabled={loading}>
            {loading
              ? <><div className="spinner" />Submitting...</>
              : <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Verify Scan
                </>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DoctorContent ────────────────────────────────────────────────────────────

function DoctorContent() {
  const user = getUser();

  const [scans,     setScans]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [analyzing, setAnalyzing] = useState(null);
  const [tab,       setTab]       = useState('pending');

  const load = async () => {
    setLoading(true);
    try {
      const res = await doctorAPI.getPending();
      setScans(res.data.reverse());
    } catch (e) {
      console.error('Failed to load queue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const analyze = async (scanId) => {
    setAnalyzing(scanId);
    try {
      await doctorAPI.analyzeScan(scanId);
      await load();
    } catch (e) {
      const detail = e.response?.data?.detail;
      const msg    = extractDetail(detail) || e.message || 'AI analysis failed. Check server logs.';
      alert(`Analysis failed:\n\n${msg}`);
    } finally {
      setAnalyzing(null);
    }
  };

  const pending  = scans.filter(s => mapStatus(s.status) === 'PENDING_AI');
  const analyzed = scans.filter(s => mapStatus(s.status) === 'AI_ANALYZED');
  const verified = scans.filter(s => mapStatus(s.status) === 'DOCTOR_VERIFIED');
  const all      = scans;

  const displayScans =
    tab === 'pending'  ? pending  :
    tab === 'analyzed' ? analyzed :
    tab === 'verified' ? verified : all;

  return (
    <div className="layout">
      <Navbar user={user} />
      {selected && (
        <VerifyModal
          scan={selected}
          onClose={() => setSelected(null)}
          onDone={load}
        />
      )}

      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">Doctor Dashboard</div>
            <div className="topbar-subtitle">Analyze AI results and verify scans</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={load}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
            </svg>
            Refresh
          </button>
        </div>

        <div className="page-content">
          <div className="stats-grid">
            <div className="stat-card amber">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="stat-value">{pending.length}</div>
              <div className="stat-label">Pending Analysis</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div className="stat-value">{analyzed.length}</div>
              <div className="stat-label">AI Analyzed</div>
            </div>
            <div className="stat-card cyan">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <div className="stat-value">{verified.length}</div>
              <div className="stat-label">Verified by Me</div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="10" rx="2"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                </svg>
              </div>
              <div className="stat-value">{all.length}</div>
              <div className="stat-label">Total in Queue</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="10" rx="2"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                </svg>
                Scan Workqueue
              </span>

              <div className="tabs">
                {[
                  { key: 'pending',  label: 'Pending',  count: pending.length  },
                  { key: 'analyzed', label: 'AI Done',  count: analyzed.length },
                  { key: 'verified', label: 'Verified', count: verified.length },
                  { key: 'all',      label: 'All',      count: all.length      },
                ].map(t => (
                  <button
                    key={t.key}
                    className={`tab-btn ${tab === t.key ? 'active' : ''}`}
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                    {t.count > 0 && (
                      <span style={{
                        marginLeft: 5,
                        background:  tab === t.key ? 'var(--cyan)'      : 'var(--bg-hover)',
                        color:       tab === t.key ? 'var(--bg-canvas)' : 'var(--text-muted)',
                        borderRadius: 'var(--radius-full)',
                        padding: '1px 6px', fontSize: 10.5, fontWeight: 700,
                      }}>
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-body-flush">
              <div className="table-wrap">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"/>
                    <span>Loading queue…</span>
                  </div>
                ) : displayScans.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                      </svg>
                    </div>
                    <div className="empty-title">Queue is clear</div>
                    <div className="empty-desc">No scans in this category</div>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Scan ID</th>
                        <th>Patient ID</th>
                        <th>Status</th>
                        <th>Prediction</th>
                        <th>Confidence</th>
                        <th>Uploaded</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayScans.map(scan => {
                        const mappedStatus = mapStatus(scan.status);
                        const sb = getStatusBadge(mappedStatus);

                        const predictionColor =
                          scan.prediction === 'Normal' ? 'var(--green)'
                          : scan.prediction            ? 'var(--red)'
                          :                              'var(--text-muted)';

                        return (
                          <tr key={scan.id}>
                            <td><span className="mono text-cyan">#{scan.id}</span></td>
                            <td><span className="mono text-secondary">P-{scan.patient_id}</span></td>

                            <td>
                              <span className={`badge ${sb.cls}`}>
                                <span className="badge-dot"/>
                                {sb.label}
                              </span>
                            </td>

                            <td>
                              {scan.prediction
                                ? <span style={{ fontWeight: 600, color: predictionColor }}>
                                    {scan.prediction}
                                  </span>
                                : <span className="text-muted">—</span>}
                            </td>

                            <td>
                              {scan.confidence != null
                                ? <ConfidenceBar value={scan.confidence} />
                                : <span className="text-muted">—</span>}
                            </td>

                            <td>
                              <span className="text-sm text-muted">{fmt(scan.created_at)}</span>
                            </td>

                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {mappedStatus === 'PENDING_AI' && (
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => analyze(scan.id)}
                                    disabled={analyzing === scan.id}
                                  >
                                    {analyzing === scan.id
                                      ? <><div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />Running…</>
                                      : 'Run AI'}
                                  </button>
                                )}

                                {mappedStatus === 'AI_ANALYZED' && (
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setSelected(scan)}
                                  >
                                    Verify
                                  </button>
                                )}

                                {mappedStatus === 'DOCTOR_VERIFIED' && (
                                  <span style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>
                                    ✓ Verified
                                  </span>
                                )}

                                {!['PENDING_AI', 'AI_ANALYZED', 'DOCTOR_VERIFIED'].includes(mappedStatus) && (
                                  <span className="text-muted" style={{ fontSize: 12 }}>—</span>
                                )}
                              </div>
                            </td>
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

export default function DoctorDashboard() {
  return (
    <ProtectedRoute allowedRole="doctor">
      <DoctorContent />
    </ProtectedRoute>
  );
}