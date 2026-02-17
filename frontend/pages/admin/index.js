# frontend/pages/admin/index.js

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { adminAPI, getUser } from '../../services/api';
import ReportDownloadButton from '../../components/ReportDownloadButton';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function predictionColor(prediction) {
  if (!prediction) return 'var(--text-muted)';
  if (prediction === 'Normal') return 'var(--green)';
  const workflowStatuses = ['REPORT_READY', 'PENDING', 'PROCESSING', 'REVIEWED', 'PHARMACIST_DONE'];
  if (workflowStatuses.includes(prediction.toUpperCase())) return 'var(--text-muted)';
  return 'var(--red)';
}

/* ─── Toast ────────────────────────────────────────────────────────────────── */
function Toast({ message, type, scanId, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success: 'var(--green)', error: 'var(--red)', info: 'var(--cyan)' };

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'var(--bg-panel)', border: `1px solid ${colors[type] ?? 'var(--border)'}`,
      borderRadius: 'var(--radius-md)', padding: '12px 18px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
      minWidth: 280, maxWidth: 420,
      animation: 'slideUp 0.25s ease',
    }}>
      {type === 'success' && (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={colors.success} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      )}
      {type === 'error' && (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={colors.error} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: 'var(--text-primary)', marginBottom: scanId ? 8 : 0 }}>
          {message}
        </div>
        {/* Quick PDF download button in the toast */}
        {scanId && type === 'success' && (
          <ReportDownloadButton scanId={scanId} label="Download PDF" size="sm" />
        )}
      </div>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0 }}
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

/* ─── ApproveModal ─────────────────────────────────────────────────────────── */
function ApproveModal({ scan, onClose, onDone, showToast }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const approve = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await adminAPI.approve(scan.id);
      onDone();
      onClose();
      // Pass the scan ID so the toast can show a download button
      showToast(
        `Report approved and emailed to patient (P-${scan.patient_id}).`,
        'success',
        scan.id,
      );
    } catch (e) {
      const msg = e.response?.data?.detail || 'Approval failed. Check your network or token.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Approve Report</div>
            <div className="modal-subtitle">Finalize scan #{scan.id} as REPORT_READY</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Scan summary */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div className="form-label" style={{ marginBottom: 3 }}>Patient ID</div>
                <div className="mono text-cyan">P-{scan.patient_id}</div>
              </div>
              <div>
                <div className="form-label" style={{ marginBottom: 3 }}>AI Prediction</div>
                <div style={{ fontWeight: 700, color: predictionColor(scan.prediction) }}>
                  {scan.prediction || '—'}
                </div>
              </div>
            </div>
            {scan.doctor_notes && (
              <div style={{ marginTop: 12 }}>
                <div className="form-label" style={{ marginBottom: 3 }}>Doctor Notes</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{scan.doctor_notes}</div>
              </div>
            )}
            {scan.pharmacist_notes && (
              <div style={{ marginTop: 12 }}>
                <div className="form-label" style={{ marginBottom: 3 }}>Prescription</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{scan.pharmacist_notes}</div>
              </div>
            )}
          </div>

          {/* Inline backend error */}
          {errorMsg && (
            <div className="alert alert-error" style={{ marginBottom: 12 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              {errorMsg}
            </div>
          )}

          <div className="alert alert-info">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Approving will mark this report as REPORT_READY, generate the PDF, and email it to the patient.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-success" onClick={approve} disabled={loading}>
            {loading
              ? <><div className="spinner" />Approving...</>
              : <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Approve & Email
                </>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AdminContent ─────────────────────────────────────────────────────────── */
function AdminContent() {
  const user = getUser();
  const [scans, setScans]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState('');
  const [toast, setToast]       = useState(null); // { message, type, scanId? }

  const showToast = (message, type = 'info', scanId = null) =>
    setToast({ message, type, scanId });
  const hideToast = () => setToast(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPending();
      setScans(res.data.reverse());
    } catch (e) {
      if (e.response?.status !== 401) {
        showToast(e.response?.data?.detail || 'Failed to load pending reports.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = scans.filter(s => {
    const q = search.toLowerCase();
    return !q
      || String(s.id).includes(q)
      || String(s.patient_id).includes(q)
      || (s.prediction || '').toLowerCase().includes(q);
  });

  const pending   = scans.length;
  const uniquePts = new Set(scans.map(s => s.patient_id)).size;
  const abnormal  = scans.filter(s => s.prediction && s.prediction !== 'Normal').length;
  const today     = scans.filter(s =>
    s.created_at && new Date(s.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="layout">
      <Navbar user={user} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          scanId={toast.scanId}
          onClose={hideToast}
        />
      )}

      {selected && (
        <ApproveModal
          scan={selected}
          onClose={() => setSelected(null)}
          onDone={load}
          showToast={showToast}
        />
      )}

      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">Admin Dashboard</div>
            <div className="topbar-subtitle">Final report approval and system oversight</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                style={{ paddingLeft: 32, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 13.5, padding: '8px 12px 8px 32px', outline: 'none', width: 200 }}
                placeholder="Search scans..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="page-content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card amber">
              <div className="stat-icon"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div className="stat-value">{pending}</div>
              <div className="stat-label">Awaiting Approval</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>
              <div className="stat-value">{uniquePts}</div>
              <div className="stat-label">Unique Patients</div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
              <div className="stat-value">{abnormal}</div>
              <div className="stat-label">Abnormal Findings</div>
            </div>
            <div className="stat-card cyan">
              <div className="stat-icon"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
              <div className="stat-value">{today}</div>
              <div className="stat-label">Today's Submissions</div>
            </div>
          </div>

          {/* Workflow info bar */}
          {scans.length > 0 && (
            <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="var(--amber)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  All items shown have been processed by the{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>Doctor</strong> and{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>Pharmacist</strong>. Approving will generate the PDF and email it to the patient.
                </span>
              </div>
            </div>
          )}

          {/* Reports table */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="M16 13H8M16 17H8M10 9H8"/>
                </svg>
                Reports Pending Final Approval
              </span>
              {search && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<span style={{ color: 'var(--cyan)' }}>{search}</span>"
                </span>
              )}
            </div>

            <div className="card-body-flush">
              <div className="table-wrap">
                {loading ? (
                  <div className="loading-state"><div className="spinner"/><span>Loading reports...</span></div>
                ) : filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                      </svg>
                    </div>
                    <div className="empty-title">{search ? 'No matching records' : 'Nothing to approve'}</div>
                    <div className="empty-desc">{search ? 'Try a different search term' : 'All completed reports have been approved'}</div>
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
                        <th>Prescription</th>
                        <th>Submitted</th>
                        <th>Approve</th>
                        <th>PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(scan => (
                        <tr key={scan.id}>
                          <td><span className="mono text-cyan">#{scan.id}</span></td>
                          <td><span className="mono text-secondary">P-{scan.patient_id}</span></td>
                          <td>
                            {scan.prediction
                              ? <span style={{ fontWeight: 700, color: predictionColor(scan.prediction) }}>{scan.prediction}</span>
                              : <span className="text-muted">—</span>}
                          </td>
                          <td>
                            {scan.confidence != null
                              ? <span className="font-mono" style={{ fontSize: 13 }}>{Math.round(scan.confidence * 100)}%</span>
                              : <span className="text-muted">—</span>}
                          </td>
                          <td style={{ maxWidth: 180 }}>
                            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                              {scan.doctor_notes
                                ? (scan.doctor_notes.length > 60 ? scan.doctor_notes.slice(0, 60) + '…' : scan.doctor_notes)
                                : <span className="text-muted">—</span>}
                            </span>
                          </td>
                          <td style={{ maxWidth: 180 }}>
                            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                              {scan.pharmacist_notes
                                ? (scan.pharmacist_notes.length > 60 ? scan.pharmacist_notes.slice(0, 60) + '…' : scan.pharmacist_notes)
                                : <span className="text-muted">—</span>}
                            </span>
                          </td>
                          <td><span className="text-sm text-muted">{fmt(scan.created_at)}</span></td>
                          <td>
                            <button className="btn btn-success btn-sm" onClick={() => setSelected(scan)}>
                              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                              Approve
                            </button>
                          </td>
                          {/* PDF download — only shows if already REPORT_READY (re-downloads) */}
                          <td>
                            <ReportDownloadButton scanId={scan.id} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Audit note */}
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              All approval actions are logged for compliance. Approving generates and emails the PDF report to the patient automatically.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}