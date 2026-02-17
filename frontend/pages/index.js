# frontend/pages/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const features = [
  {
    icon: '🫁',
    title: 'AI Detection',
    text: 'TensorFlow model analyzes scans for Normal vs Pneumonia with confidence scores',
    color: '#00d4ff',
  },
  {
    icon: '🔄',
    title: 'Smart Workflow',
    text: 'Automatic routing: Patient → Doctor → Pharmacist → Admin',
    color: '#7c3aed',
  },
  {
    icon: '🔐',
    title: 'Role-Based Access',
    text: '4 roles with JWT-secured endpoints and granular permissions',
    color: '#059669',
  },
  {
    icon: '📋',
    title: 'Report Pipeline',
    text: 'From upload to final approval — fully tracked scan status',
    color: '#f59e0b',
  },
];

const stats = [
  { value: '99.2%', label: 'AI Accuracy' },
  { value: '<2s', label: 'Scan Analysis' },
  { value: '4', label: 'User Roles' },
  { value: '100%', label: 'HIPAA Aligned' },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);

  // JWT expiry check + redirect
  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;

        if (payload.exp && payload.exp < now) {
          localStorage.clear();
          return;
        }

        router.replace(`/${parsed.role}`);
      } catch {
        localStorage.clear();
      }
    }
  }, [router]);

  // Staggered card reveal on mount
  useEffect(() => {
    if (!mounted) return;
    features.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, i]);
      }, 600 + i * 150);
    });
  }, [mounted]);

  return (
    <>
      <Head>
        <title>CSSS – Clinical Scan Support System</title>
        <meta
          name="description"
          content="AI-powered medical scan analysis for patients, doctors, pharmacists, and admins. CT, MRI & X-ray analysis with automated workflow."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="CSSS – Clinical Scan Support System" />
        <meta
          property="og:description"
          content="Intelligent CT, MRI & X-ray analysis with automated workflow across patients, doctors, pharmacists and administrators."
        />
        <meta name="theme-color" content="#080c10" />
      </Head>

      <div className="csss-root">
        {/* Background grid */}
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-glow bg-glow-1" aria-hidden="true" />
        <div className="bg-glow bg-glow-2" aria-hidden="true" />

        {/* ── Top Nav ── */}
        <nav className="top-nav" role="navigation" aria-label="Main navigation">
          <span className="nav-brand" aria-label="CSSS Home">
            <span className="brand-icon" aria-hidden="true">⚕</span>
            CSSS
          </span>
          <div className="nav-links">
            <Link href="/login" className="btn btn-ghost btn-sm" aria-label="Sign in to your account">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm" aria-label="Create a new account">
              Register
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <main className="hero-section" id="main-content">
          <div className={`hero-content ${mounted ? 'hero-visible' : ''}`}>

            {/* Badge */}
            <div className="hero-badge" role="status">
              <span className="badge-dot" aria-hidden="true" />
              AI-Powered Medical Imaging
            </div>

            {/* Headline */}
            <h1 className="hero-title">
              Clinical Scan<br />
              <span className="hero-accent">Support System</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Intelligent CT, MRI &amp; X-ray analysis with automated workflow
              across patients, doctors, pharmacists and administrators.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta" role="group" aria-label="Get started actions">
              <Link href="/register" className="btn btn-primary btn-lg cta-main">
                Get Started
                <span className="cta-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg cta-secondary">
                Sign In
              </Link>
            </div>

            {/* Stats Row */}
            <div className="stats-row" role="list" aria-label="Platform statistics">
              {stats.map((s) => (
                <div key={s.label} className="stat-item" role="listitem">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Feature Cards ── */}
          <div
            className="features-grid"
            role="list"
            aria-label="Platform features"
          >
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`feature-card ${visibleCards.includes(i) ? 'card-visible' : ''}`}
                role="listitem"
                style={{ '--card-accent': f.color }}
              >
                <div className="card-icon" aria-hidden="true">{f.icon}</div>
                <h2 className="card-title">{f.title}</h2>
                <p className="card-text">{f.text}</p>
                <div className="card-accent-bar" aria-hidden="true" />
              </div>
            ))}
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="site-footer" role="contentinfo">
          <span>© {new Date().getFullYear()} Clinical Scan Support System</span>
          <span className="footer-sep" aria-hidden="true">·</span>
          <span>Powered by TensorFlow &amp; Next.js</span>
        </footer>
      </div>

      <style jsx global>{`
        /* ── Reset & Base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-base:        #080c10;
          --bg-card:        rgba(14, 20, 28, 0.85);
          --border:         rgba(0, 212, 255, 0.12);
          --border-hover:   rgba(0, 212, 255, 0.35);
          --cyan-bright:    #00d4ff;
          --cyan-dim:       rgba(0, 212, 255, 0.6);
          --text-primary:   #f0f6fc;
          --text-secondary: rgba(240, 246, 252, 0.6);
          --font-display:   'Courier New', 'Consolas', monospace;
          --font-body:      -apple-system, 'Segoe UI', sans-serif;
          --radius:         12px;
          --transition:     0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg-base);
          color: var(--text-primary);
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── Root ── */
        .csss-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* ── Backgrounds ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .bg-glow {
          position: fixed; z-index: 0; pointer-events: none;
          border-radius: 50%; filter: blur(120px); opacity: 0.18;
        }
        .bg-glow-1 {
          width: 700px; height: 700px;
          top: -200px; left: -200px;
          background: radial-gradient(circle, #00d4ff 0%, transparent 70%);
          animation: driftA 18s ease-in-out infinite alternate;
        }
        .bg-glow-2 {
          width: 500px; height: 500px;
          bottom: -150px; right: -100px;
          background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
          animation: driftB 22s ease-in-out infinite alternate;
        }

        @keyframes driftA {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(80px, 60px) scale(1.15); }
        }
        @keyframes driftB {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-60px, -40px) scale(1.1); }
        }

        /* ── Nav ── */
        .top-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(20px, 5vw, 48px);
          height: 60px;
          background: rgba(8, 12, 16, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }

        .nav-brand {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display);
          font-weight: 800; font-size: 1.1rem;
          color: var(--cyan-bright);
          letter-spacing: 0.06em;
          text-decoration: none;
        }
        .brand-icon { font-size: 1.3rem; }

        .nav-links { display: flex; gap: 10px; align-items: center; }

        /* ── Buttons ── */
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 6px; text-decoration: none; border: none; cursor: pointer;
          font-family: var(--font-body); font-weight: 600;
          transition: all var(--transition);
          white-space: nowrap;
        }

        .btn-sm  { padding: 6px 16px;  font-size: 0.8rem;  border-radius: 8px; }
        .btn-lg  { padding: 12px 28px; font-size: 0.95rem; border-radius: 10px; }

        .btn-primary {
          background: var(--cyan-bright);
          color: #080c10;
          box-shadow: 0 0 20px rgba(0,212,255,0.25);
        }
        .btn-primary:hover {
          background: #33ddff;
          box-shadow: 0 0 32px rgba(0,212,255,0.45);
          transform: translateY(-1px);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .btn-ghost:hover {
          border-color: var(--border-hover);
          background: rgba(0,212,255,0.06);
          color: var(--cyan-bright);
        }

        /* ── Hero Section ── */
        .hero-section {
          position: relative; z-index: 1;
          padding: clamp(100px, 14vw, 140px) clamp(20px, 6vw, 80px) 40px;
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-content {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hero-content.hero-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Badge */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px;
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 100px;
          font-size: 0.78rem; font-weight: 600;
          color: var(--cyan-bright);
          letter-spacing: 0.04em;
          margin-bottom: 28px;
        }
        .badge-dot {
          width: 7px; height: 7px;
          background: var(--cyan-bright);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--cyan-bright);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        /* Title */
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          margin-bottom: 22px;
        }
        .hero-accent {
          background: linear-gradient(135deg, var(--cyan-bright) 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Subtitle */
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: var(--text-secondary);
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 36px;
        }

        /* CTA */
        .hero-cta {
          display: flex; gap: 14px; flex-wrap: wrap;
          margin-bottom: 52px;
        }
        .cta-main {
          position: relative; overflow: hidden;
        }
        .cta-main::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15));
          opacity: 0;
          transition: opacity var(--transition);
        }
        .cta-main:hover::after { opacity: 1; }
        .cta-arrow {
          display: inline-block;
          transition: transform var(--transition);
        }
        .cta-main:hover .cta-arrow { transform: translateX(4px); }

        /* Stats */
        .stats-row {
          display: flex; gap: clamp(24px, 4vw, 48px);
          flex-wrap: wrap;
          padding: 24px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          margin-bottom: 64px;
        }
        .stat-item {
          display: flex; flex-direction: column; gap: 3px;
        }
        .stat-value {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          font-weight: 800;
          color: var(--cyan-bright);
          letter-spacing: -0.03em;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── Feature Cards ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          padding-bottom: 60px;
        }

        .feature-card {
          position: relative;
          padding: 28px 24px 32px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          overflow: hidden;
          cursor: default;

          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 0.5s ease,
            transform 0.5s ease,
            border-color var(--transition),
            box-shadow var(--transition);
        }
        .feature-card.card-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .feature-card:hover {
          border-color: var(--card-accent, var(--border-hover));
          box-shadow: 0 0 32px color-mix(in srgb, var(--card-accent) 20%, transparent);
          transform: translateY(-4px);
        }

        /* Glow shimmer on hover */
        .feature-card::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at center, var(--card-accent) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .feature-card:hover::before { opacity: 0.06; }

        .card-icon {
          font-size: 2rem;
          margin-bottom: 14px;
          display: block;
          filter: drop-shadow(0 0 8px var(--card-accent));
          transition: transform 0.3s ease;
        }
        .feature-card:hover .card-icon { transform: scale(1.12) rotate(-4deg); }

        .card-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .card-text {
          font-size: 0.855rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        .card-accent-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: var(--card-accent, var(--cyan-bright));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .feature-card:hover .card-accent-bar { transform: scaleX(1); }

        /* ── Footer ── */
        .site-footer {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 20px;
          border-top: 1px solid var(--border);
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .footer-sep { opacity: 0.4; }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .hero-title { font-size: 2.2rem; }
          .stats-row  { gap: 20px; }
          .hero-cta   { flex-direction: column; align-items: flex-start; }
          .btn-lg     { width: 100%; justify-content: center; }
          .features-grid { grid-template-columns: 1fr; }
          .site-footer { flex-direction: column; gap: 4px; text-align: center; }
        }

        @media (max-width: 480px) {
          .hero-section { padding-top: 88px; }
        }

        /* ── Reduced Motion ── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </>
  );
}