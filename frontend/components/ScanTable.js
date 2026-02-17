# frontend/components/ScanTable.js

import { useMemo } from 'react';
import { getStatusBadge, fmtDate } from '../services/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ScanTable({
  scans,
  loading,
  onAction,
  actionLabel,
  actionCls = 'btn-primary',
  showImage = false,
}) {
  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!scans || scans.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🫁</div>
        <div className="empty-title">No scans found</div>
        <div className="empty-text">Check back later or refresh the page</div>
      </div>
    );
  }

  // ── Memoized rows (performance for large lists) ────────────────────────────
  const rows = useMemo(() =>
    scans.map(scan => {
      // FIX: safely handles confidence = 0
      const conf = typeof scan.confidence === 'number'
        ? Math.round(scan.confidence * 100)
        : null;

      // FIX: fallback if getStatusBadge returns null/undefined
      const st = getStatusBadge(scan.status) || { label: 'Unknown', cls: 'badge-default' };

      return (
        <tr key={scan.id}>
          {/* ── Optional image column ── */}
          {showImage && (
            <td>
              <img
                src={`${BASE_URL}/uploads/${scan.filename}`}
                alt={`Scan #${scan.id} of patient ${scan.patient_id}`}
                className="scan-thumb"
                onError={e => {
                  e.target.onerror = null;                      // prevent infinite loop
                  e.target.src = '/placeholder-scan.png';       // FIX: show placeholder
                }}
              />
            </td>
          )}

          {/* ── Scan ID ── */}
          <td>
            <span className="id-chip">#{scan.id}</span>
          </td>

          {/* ── Patient ID ── */}
          <td className="mono text-muted">
            P-{scan.patient_id}
          </td>

          {/* ── Status badge ── */}
          <td>
            <span className={`badge ${st.cls}`}>{st.label}</span>
          </td>

          {/* ── Prediction ── */}
          <td>
            {scan.prediction
              ? (
                <span className={
                  scan.prediction === 'Normal'
                    ? 'prediction-normal'
                    : 'prediction-abnormal'
                }>
                  {scan.prediction}
                </span>
              )
              : <span className="text-muted">—</span>}
          </td>

          {/* ── Confidence bar ── */}
          <td>
            {conf !== null
              ? (
                <div className="confidence-inline">
                  <div className="confidence-bar-inline">
                    <div
                      className="confidence-fill-inline"
                      style={{ width: `${conf}%` }}
                    />
                  </div>
                  <span className="mono">{conf}%</span>
                </div>
              )
              : <span className="text-muted">—</span>}
          </td>

          {/* ── Doctor notes ── */}
          <td className="text-truncate">
            {scan.doctor_notes || <span className="text-muted">—</span>}
          </td>

          {/* ── Pharmacist notes ── */}
          <td className="text-truncate">
            {scan.pharmacist_notes || <span className="text-muted">—</span>}
          </td>

          {/* ── Date ── */}
          <td className="mono text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
            {fmtDate(scan.created_at)}
          </td>

          {/* ── Action button ── */}
          {onAction && (
            <td>
              <button
                className={`btn ${actionCls} btn-sm`}
                onClick={() => onAction(scan)}
                title={`Perform ${actionLabel} on scan #${scan.id}`}  // FIX: accessibility
              >
                {actionLabel}
              </button>
            </td>
          )}
        </tr>
      );
    }),
  [scans, showImage, onAction, actionLabel, actionCls]   // deps for useMemo
  );

  // ── Table ──────────────────────────────────────────────────────────────────
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {showImage && <th>Image</th>}
            <th>Scan ID</th>
            <th>Patient</th>
            <th>Status</th>
            <th>Prediction</th>
            <th>Confidence</th>
            <th>Doctor Notes</th>
            <th>Rx Notes</th>
            <th>Date</th>
            {onAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}