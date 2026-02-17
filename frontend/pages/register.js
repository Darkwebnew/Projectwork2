# frontend/pages/register.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../services/api';

const ROLES = [
  { value: 'patient',    label: '🧑  Patient',    desc: 'Upload scans and track your results' },
  { value: 'doctor',     label: '👨‍⚕️  Doctor',     desc: 'Analyze scans and write clinical notes' },
  { value: 'pharmacist', label: '💊  Pharmacist', desc: 'Complete prescriptions for verified scans' },
  { value: 'admin',      label: '🛡️  Admin',      desc: 'Final approval and report publishing' },
];

// Simplified per suggestion
function getPasswordStrength(pass) {
  if (!pass) return 0;
  let score = 0;
  if (pass.length >= 6)   score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  return score;
}

function segmentClass(strength, index) {
  if (index + 1 > strength) return '';
  return ['strength-weak', 'strength-fair', 'strength-strong'][strength - 1];
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Strong'];
const STRENGTH_COLORS = ['', 'var(--red)', 'var(--amber)', 'var(--green)'];

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Improvement #2 — clear error on every keystroke
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // ✅ Improvement #1 — full client-side validation
  function validate() {
    if (!form.name.trim())        { setError('Name is required.');              return false; }
    if (!isValidEmail(form.email)){ setError('Enter a valid email address.');   return false; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await authAPI.register(form);
      setSuccess(true);
      // ✅ router.replace so Register won't sit in browser history
      setTimeout(() => router.replace('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);
  // ✅ Improvement #4 — warn but still allow submit for weak passwords
  const isWeak = form.password.length > 0 && strength < 2;

  return (
    <div className="auth-layout">
      <div className="auth-bg-grid" />
      <div className="auth-box" style={{ maxWidth: 460 }}>

        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--bg-canvas)" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <div className="brand-name" style={{ fontSize: 18 }}>CSSS</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clinical Scan Support System</div>
          </div>
        </div>

        <h2 className="auth-title">Create an account</h2>
        <p className="auth-subtitle">Join the clinical workflow platform</p>

        {/* ✅ Improvement #3 — aria-live for screen readers */}
        <div aria-live="polite">
          {error && (
            <div className="alert alert-error" role="alert">
              <span aria-hidden="true">⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="status">
              <span aria-hidden="true">✅</span> Account created! Redirecting to login…
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="floating-group mb-6">
            <input
              type="text"
              id="reg-name"
              name="name"
              className="form-control"
              placeholder=" "
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
              aria-required="true"
            />
            <label className="form-label" htmlFor="reg-name">Full Name</label>
          </div>

          {/* Email */}
          <div className="floating-group mb-6">
            <input
              type="email"
              id="reg-email"
              name="email"
              className="form-control"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-required="true"
            />
            <label className="form-label" htmlFor="reg-email">Email address</label>
          </div>

          {/* Password + eye toggle */}
          <div className="floating-group" style={{ marginBottom: 6 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="reg-password"
              name="password"
              className="form-control"
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              aria-required="true"
              aria-describedby="password-strength-label"
              style={{ paddingRight: 44 }}
            />
            <label className="form-label" htmlFor="reg-password">Password</label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', padding: 4, zIndex: 20,
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Password strength meter */}
          {form.password.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              {/* ✅ Improvement #3 — ARIA meter role for screen readers */}
              <div
                className="strength-meter"
                role="meter"
                aria-label="Password strength"
                aria-valuenow={strength}
                aria-valuemin={0}
                aria-valuemax={3}
              >
                {[0, 1, 2].map((i) => (
                  <div key={i} className={'strength-segment ' + segmentClass(strength, i)} />
                ))}
              </div>
              <div
                id="password-strength-label"
                style={{
                  fontSize: 11, marginTop: 5,
                  color: STRENGTH_COLORS[strength],
                  fontWeight: 600, letterSpacing: '0.04em',
                }}
              >
                {STRENGTH_LABELS[strength]} password
                {strength === 1 && (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                    {' — add uppercase & numbers'}
                  </span>
                )}
                {strength === 2 && (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                    {' — add numbers or uppercase'}
                  </span>
                )}
              </div>

              {/* ✅ Improvement #4 — soft warning for weak passwords */}
              {isWeak && (
                <div style={{
                  marginTop: 6, fontSize: 11, color: 'var(--amber)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <span aria-hidden="true">⚠️</span>
                  <span>Weak passwords are less secure. You can still proceed.</span>
                </div>
              )}
            </div>
          )}

          {/* Role select */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">Role</label>
            <select
              id="reg-role"
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <p
              style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}
              aria-live="polite"
            >
              {ROLES.find((r) => r.value === form.role)?.desc}
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center', padding: '11px' }}
            disabled={loading || success}
            aria-busy={loading}
          >
            {loading
              ? <><span className="spinner" aria-hidden="true" /> Creating...</>
              : 'Create Account →'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link href="/login">Sign in →</Link>
        </p>

      </div>
    </div>
  );
}