# frontend/pages/login.js

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI, setUser } from '../services/api';

// ─── JWT decode utility ───────────────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id:    payload.user_id,
      email: payload.email,
      role:  payload.role,
    };
  } catch {
    return null;
  }
};

// ─── Eye Icons ────────────────────────────────────────────────────────────────
const EyeOffIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Login() {
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Prefill email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setForm((f) => ({ ...f, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login(form);
      const { access_token } = res.data;

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('remembered_email', form.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      localStorage.setItem('token', access_token);

      const user = decodeToken(access_token);
      if (!user) throw new Error('Invalid token received.');

      setUser(user);
      // Use replace so login page isn't in browser history
      router.replace(`/${user.role}`);

    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Login failed. Check your credentials.';
      setError(msg);

      // Clear password on failure, re-focus email
      setForm((f) => ({ ...f, password: '' }));
      setTimeout(() => emailRef.current?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = (email, password) => {
    setForm({ email, password });
    emailRef.current?.focus();
  };

  const testAccounts = [
    { label: 'Admin',    email: 'admin@csss.com',   password: 'Admin123'   },
    { label: 'Doctor',   email: 'doctor@csss.com',  password: 'Doctor123'  },
    { label: 'Pharma',   email: 'pharma@csss.com',  password: 'Pharma123'  },
    { label: 'Patient',  email: 'patient@csss.com', password: 'Patient123' },
  ];

  return (
    <div className="auth-layout">
      <div className="auth-bg-grid" />
      <div className="auth-box">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
              stroke="var(--bg-canvas)" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <div className="brand-name" style={{ fontSize: 18 }}>CSSS</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Clinical Scan Support System
            </div>
          </div>
        </div>

        <h2 className="auth-title">Sign in to your account</h2>
        <p className="auth-subtitle">Access your clinical dashboard</p>

        {/* Error alert with aria-live for screen readers */}
        {error && (
          <div
            className="alert alert-error"
            role="alert"
            aria-live="polite"
          >
            <span aria-hidden="true">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="floating-group mb-6">
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
              autoComplete="email"
              aria-label="Email address"
            />
            <label className="form-label" htmlFor="email">Email address</label>
          </div>

          {/* Password */}
          <div className="floating-group mb-4" style={{ position: 'relative' }}>
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              className="form-control"
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              aria-label="Password"
              style={{ paddingRight: 44 }}
            />
            <label className="form-label" htmlFor="password">Password</label>

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
                zIndex: 20,
                transition: 'color 0.15s',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Remember me + Forgot password row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            fontSize: '0.8rem',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              userSelect: 'none',
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--cyan)', cursor: 'pointer' }}
                aria-label="Remember me"
              />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              style={{
                color: 'var(--cyan)',
                textDecoration: 'none',
                fontSize: '0.8rem',
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: 8,
              justifyContent: 'center',
              padding: '11px',
            }}
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? <><span className="spinner" aria-hidden="true" /> Signing in...</>
              : 'Sign In →'}
          </button>
        </form>

        <p className="auth-link">
          No account? <Link href="/register">Create one →</Link>
        </p>

        {/* Test accounts — click to fill */}
        <div style={{
          marginTop: 24,
          padding: '14px 16px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
        }}>
          <div style={{ color: 'var(--cyan)', marginBottom: 8, fontFamily: 'inherit' }}>
            Test Accounts — click to fill
          </div>
          {testAccounts.map(({ label, email, password }) => (
            <button
              key={label}
              type="button"
              onClick={() => fillTestAccount(email, password)}
              title={`Login as ${label}`}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '2px 0',
                lineHeight: 1.8,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {email.padEnd(24)} / {password}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}