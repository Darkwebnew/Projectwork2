# frontend/pages/pharmacist/index.js

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { pharmacistAPI, getUser } from '../../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const safeText = (text, maxLength = 70) =>
  text ? (text.length > maxLength ? text.slice(0, maxLength) + '…' : text) : '—';

const isToday = (dt) => {
  if (!dt) return false;
  const d = new Date(dt);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

// ─── Normalize notes before sending ─────────────────────────────────────────
// 1. Trim leading/trailing whitespace
// 2. Collapse multiple spaces into one
// 3. Replace em-dash "—" with plain hyphen "-" for backend compatibility

const normalizeNotes = (raw) =>
  raw
    .trim()
    .replace(/\s{2,}/g, ' ')
    .replace(/—/g, '-');

// ─── Confidence Bar ──────────────────────────────────────────────────────────

function ConfidenceBar({ value }) {
  if (value == null) return <span className="text-muted">—</span>;
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow, #f59e0b)' : 'var(--red)';
  return (
    <div style={{ minWidth: 90 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Confidence</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--border)', borderRadius: 99 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

// ─── Prescription Modal ──────────────────────────────────────────────────────

const TEMPLATES = [
  'Amoxicillin 500mg - 3x daily for 7 days. Take with food.',
  'Azithromycin 250mg - 1x daily for 5 days on empty stomach.',
  'Salbutamol inhaler - 2 puffs every 4-6 hours as needed.',
  'Prednisone 20mg - 1x daily for 5 days. Do not stop abruptly.',
  'Cetirizine 10mg - 1x nightly. May cause drowsiness.',
];

function PrescriptionModal({ scan, onClose, onDone }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state whenever the active scan changes
  useEffect(() => {
    setNotes('');
    setError('');
  }, [scan]);

  const applyTemplate = (t) => {
    if (notes.trim() && notes !== t) {
      if (!window.confirm('Replace current notes with this template?')) return;
    }
    setNotes(t);
  };

  const submit = async () => {
    // ✅ FIX 1: Normalize before validation — trim + collapse spaces + replace em-dash
    const finalNotes = normalizeNotes(notes);

    // ✅ FIX 2: Validate the normalized string, not the raw textarea value
    if (!finalNotes) {
      setError('Prescription notes are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ FIX 3: Pass the string directly — pharmacistAPI.complete wraps it as { notes }
      // Passing { notes: finalNotes } here would create { notes: { notes: "..." } } — nested bug
      await pharmacistAPI.complete(scan.id, finalNotes);
      onDone();
      onClose();
    } catch (e) {
      if (!e.response) {
        setError('Network error. Please check your connection.');
      } else {
        const detail = e.response.data?.detail;

        if (Array.isArray(detail)) {
          // FastAPI validation error list: [{ msg: "..." }, ...]
          setError(detail.map(err => err.msg).join(', '));
        } else if (typeof detail === 'string') {
          // Standard FastAPI HTTPException string
          setError(detail);
        } else if (detail && typeof detail === 'object') {
          // Fallback for unexpected object shapes
          setError(JSON.stringify(detail));
        } else {
          setError('Failed to complete prescription. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Complete Prescription</div>
            <div className="modal-subtitle">Scan #{scan.id} — Patient P-{scan.patient_id}</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          {/* Scan summary */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <div className="form-label" style={{ marginBottom: 3 }}>Diagnosis</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: scan.prediction === 'Normal' ? 'var(--green)' : 'var(--red)' }}>
                  {scan.prediction || '—'}
                </div>
              </div>
              <div>
                <div className="form-label" style={{ marginBottom: 3 }}>Doctor Notes</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {scan.doctor_notes || <span className="text-muted">No notes</span>}
                </div>
              </div>
            </div>
            {scan.confidence != null && (
              <div style={{ marginTop: 4 }}>
                <ConfidenceBar value={scan.confidence} />
              </div>
            )}
          </div>

          {/* Quick templates */}
          <div style={{ marginBottom: 12 }}>
            <div className="form-label" style={{ marginBottom: 8 }}>Quick templates</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 11.5 }}
                  onClick={() => applyTemplate(t)}
                >
                  {t.split('-')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Prescription Notes <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Enter medication name, dosage, frequency, duration and special instructions..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ minHeight: 120 }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={submit} disabled={loading}>
            {loading
              ? <><div className="spinner" />Processing...</>
              : <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Complete Prescription
                </>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

function PharmacistContent() {
  const user = getUser();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await pharmacistAPI.getQueue();
      setScans(Array.isArray(res.data) ? res.data.reverse() : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const todayCount    = scans.filter(s => isToday(s.created_at)).length;
  const normalCount   = scans.filter(s => s.prediction === 'Normal').length;
  const abnormalCount = scans.filter(s => s.prediction && s.prediction !== 'Normal').length;

  return (
    <div className="layout">
      <Navbar user={user} />
      {selected && (
        <PrescriptionModal
          scan={selected}
          onClose={() => setSelected(null)}
          onDone={load}
        />
      )}

      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">Pharmacist Dashboard</div>
            <div className="topbar-subtitle">Review doctor-verified scans and issue prescriptions</div>
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

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card cyan">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M10.5 20H4a2 2 0 01-2-2v-2.5M3.5 8.5l6.5-6.5a4.243 4.243 0 016 6L11.5 13.5M12 16l3.5-3.5a4.243 4.243 0 016 6l-3.5 3.5"/>
                </svg>
              </div>
              <div className="stat-value">{scans.length}</div>
              <div className="stat-label">Prescriptions Due</div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                </svg>
              </div>
              <div className="stat-value">{normalCount}</div>
              <div className="stat-label">Normal Results</div>
            </div>

            <div className="stat-card red">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div className="stat-value">{abnormalCount}</div>
              <div className="stat-label">Abnormal Results</div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8"  y1="2" x2="8"  y2="6"/>
                  <line x1="3"  y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="stat-value">{todayCount}</div>
              <div className="stat-label">Today's Queue</div>
            </div>
          </div>

          {/* Queue table */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M10.5 20H4a2 2 0 01-2-2v-2.5M3.5 8.5l6.5-6.5a4.243 4.243 0 016 6L11.5 13.5M12 16l3.5-3.5a4.243 4.243 0 016 6l-3.5 3.5"/>
                </svg>
                Prescription Queue
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '3px 10px' }}>
                {scans.length} item{scans.length !== 1 ? 's' : ''} awaiting
              </span>
            </div>

            <div className="card-body-flush">
              <div className="table-wrap">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"/>
                    <span>Loading queue...</span>
                  </div>
                ) : scans.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4"/>
                      </svg>
                    </div>
                    <div className="empty-title">All clear!</div>
                    <div className="empty-desc">No prescriptions are waiting in your queue</div>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Scan ID</th>
                        <th>Patient</th>
                        <th>Diagnosis</th>
                        <th>Confidence</th>
                        <th>Doctor Notes</th>
                        <th>Verified At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scans.map(scan => (
                        <tr key={scan.id}>
                          <td><span className="mono text-cyan">#{scan.id}</span></td>
                          <td><span className="mono text-secondary">P-{scan.patient_id}</span></td>
                          <td>
                            {scan.prediction
                              ? <span style={{ fontWeight: 700, color: scan.prediction === 'Normal' ? 'var(--green)' : 'var(--red)' }}>
                                  {scan.prediction}
                                </span>
                              : <span className="text-muted">—</span>}
                          </td>
                          <td style={{ minWidth: 110 }}>
                            <ConfidenceBar value={scan.confidence} />
                          </td>
                          <td style={{ maxWidth: 220 }}>
                            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                              {safeText(scan.doctor_notes)}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-muted">
                              {scan.created_at ? fmt(scan.created_at) : '—'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => setSelected(scan)}>
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Prescribe
                            </button>
                          </td>
                        </tr>
                      ))}
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

// ─── Export ──────────────────────────────────────────────────────────────────

export default function PharmacistDashboard() {
  return (
    <ProtectedRoute allowedRole="pharmacist">
      <PharmacistContent />
    </ProtectedRoute>
  );
}