// frontend/components/ReportDownloadButton.js
// Usage: <ReportDownloadButton scanId={scan.id} label="PDF" size="sm" />

import { useState } from 'react';

export default function ReportDownloadButton({ scanId, label = 'PDF', size = 'sm' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    // Try every key your app might use to store the JWT
    const token =
      (typeof window !== 'undefined' && (
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('jwt') ||
        localStorage.getItem('authToken')
      )) || null;

    if (!token) {
      setError('Not logged in — please sign in again.');
      setLoading(false);
      return;
    }

    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const url  = `${base}/reports/pdf/${scanId}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Error ${res.status}`);
      }

      const blob      = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
      <button
        className={`btn btn-primary btn-${size}`}
        onClick={handleDownload}
        disabled={loading}
        title={`Download PDF for scan #${scanId}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
      >
        {loading ? (
          <><div className="spinner" style={{ width: 12, height: 12 }} />Generating…</>
        ) : (
          <>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            {label}
          </>
        )}
      </button>
      {error && (
        <span style={{ fontSize: 11, color: 'var(--red)', maxWidth: 160 }}>{error}</span>
      )}
    </span>
  );
}