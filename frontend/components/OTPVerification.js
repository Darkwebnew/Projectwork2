# frontend/components/OTPVerification.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { otpAPI } from '../services/api';

export default function OTPVerification({ email, adminName, onVerified }) {
  const [otp, setOtp]             = useState('');
  const [loading, setLoading]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState('');
  const [warning, setWarning]     = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verified, setVerified]   = useState(false);

  const inputRef = useRef(null);

  // Auto-send OTP on mount (only if email is valid)
  useEffect(() => {
    if (email) handleSend();
  }, [email]);

  // Auto-focus input once OTP is sent
  useEffect(() => {
    if (sent && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sent]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSend = useCallback(async () => {
    setSending(true);
    setError('');
    setWarning('');
    setOtp(''); // Clear OTP on resend
    try {
      await otpAPI.send(email);
      setSent(true);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setSending(false);
    }
  }, [email]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    setWarning('');
    try {
      const res = await otpAPI.verify(email, otp);

      // Show success state briefly before calling onVerified
      setVerified(true);
      setTimeout(() => onVerified(res.data), 1200);
    } catch (err) {
      const detail = err.response?.data?.detail || '';
      // Differentiate server warnings (expired) vs input errors (invalid)
      if (detail.toLowerCase().includes('expired')) {
        setWarning('Your OTP has expired. Please request a new one.');
      } else {
        setError(detail || 'Invalid OTP. Please try again.');
      }
      setOtp('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || sending;

  // ── Success State ──────────────────────────────────────────────────────────
  if (verified) {
    return (
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(72,199,142,0.15)',
          border: '1px solid rgba(72,199,142,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: '1.8rem',
        }}>
          ✅
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6, color: 'var(--green, #48c78e)' }}>
          Verified Successfully
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Identity confirmed. Redirecting you in…
        </p>
      </div>
    );
  }

  // ── Main OTP UI ────────────────────────────────────────────────────────────
  return (
    <div style={{ textAlign: 'center' }}>

      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(99,179,237,0.1)',
        border: '1px solid rgba(99,179,237,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', fontSize: '1.6rem',
      }}>
        🔐
      </div>

      {/* Heading */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
        Two-Step Verification
      </h3>

      {/* Subtext */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
        {sending
          ? `Sending OTP to ${email}…`
          : sent
          ? <>OTP sent to <strong style={{ color: 'var(--cyan)' }}>{email}</strong>.<br />Check your inbox and enter the 6-digit code.</>
          : `Preparing to send OTP to ${email}…`}
      </p>

      {/* Error alert */}
      {error && (
        <div className="alert alert-error" role="alert" style={{ textAlign: 'left', marginBottom: 16 }}>
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}

      {/* Warning alert (e.g. expired OTP) */}
      {warning && (
        <div className="alert alert-warning" role="alert" style={{ textAlign: 'left', marginBottom: 16 }}>
          <span aria-hidden="true">⏰</span> {warning}
        </div>
      )}

      {/* OTP Input */}
      <div className="form-group">
        <input
          ref={inputRef}
          className="otp-input"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          autoComplete="one-time-code"
          placeholder="000000"
          value={otp}
          disabled={isBusy}
          aria-label="One-time password"
          aria-describedby="otp-hint"
          onChange={e => {
            setError('');
            setWarning('');
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
          }}
          onKeyDown={e => e.key === 'Enter' && !isBusy && handleVerify()}
        />
      </div>

      {/* Verify Button */}
      <button
        className="btn btn-primary w-full"
        style={{ marginBottom: 12 }}
        onClick={handleVerify}
        disabled={isBusy || otp.length !== 6}
        aria-label="Verify OTP"
        aria-busy={loading}
      >
        {loading
          ? <><span className="spinner" aria-hidden="true" /> Verifying…</>
          : '✓ Verify OTP'}
      </button>

      {/* Resend Button */}
      <button
        className="btn btn-ghost w-full"
        onClick={handleSend}
        disabled={isBusy || countdown > 0}
        aria-label={countdown > 0 ? `Resend available in ${countdown} seconds` : 'Resend OTP'}
        aria-busy={sending}
      >
        {sending
          ? <><span className="spinner" aria-hidden="true" /> Sending…</>
          : countdown > 0
          ? `Resend in ${countdown}s`
          : '↺ Resend OTP'}
      </button>

      {/* Hint */}
      <p id="otp-hint" style={{ marginTop: 16, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
        Check your spam folder if not received. OTP is valid for 10 minutes.
      </p>
    </div>
  );
}