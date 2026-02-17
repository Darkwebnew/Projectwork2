# frontend/components/Navbar.js

import { useRouter } from 'next/router';

// ─── Unified role config (title + subtitle + colors in one place) ───────────
const ROLES = {
  admin: {
    title:    'Admin Dashboard',
    subtitle: 'Final report approval and system oversight',
    colors: {
      bg:     'rgba(183,148,244,0.15)',
      color:  '#b794f4',
      border: 'rgba(183,148,244,0.3)',
    },
  },
  doctor: {
    title:    'Doctor Dashboard',
    subtitle: 'Analyze AI results and verify scans',
    colors: {
      bg:     'rgba(99,179,237,0.15)',
      color:  '#63b3ed',
      border: 'rgba(99,179,237,0.3)',
    },
  },
  patient: {
    title:    'Patient Dashboard',
    subtitle: 'Track your scans and reports',
    colors: {
      bg:     'rgba(72,187,120,0.15)',
      color:  '#48bb78',
      border: 'rgba(72,187,120,0.3)',
    },
  },
  pharmacist: {
    title:    'Pharmacist Dashboard',
    subtitle: 'Review doctor-verified scans and issue prescriptions',
    colors: {
      bg:     'rgba(246,173,85,0.15)',
      color:  '#f6ad55',
      border: 'rgba(246,173,85,0.3)',
    },
  },
};

// ─── Improved initials: handles single-word names & emails ──────────────────
function getInitials(user) {
  const raw   = user?.name || user?.email || '?';
  const words = raw.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ─── Logout SVG icon ────────────────────────────────────────────────────────
const LogoutIcon = () => (
  <svg
    width="12" height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

// ─── Main component ─────────────────────────────────────────────────────────
export default function Navbar({ user, rightContent }) {
  const router = useRouter();

  const role            = user?.role || 'patient';
  const { title, subtitle, colors } = ROLES[role] || ROLES.patient;
  const initials        = getInitials(user);
  const displayName     = user?.name || user?.email || 'Unknown';

  // Confirm before wiping localStorage and redirecting
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      router.push('/login');
    }
  };

  return (
    <>
      {/* ── Scoped styles (avoids inline hover hacks, keeps JSX clean) ── */}
      <style>{`
        .cs-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          z-index: 100;
          background: rgba(8, 12, 16, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(99, 179, 237, 0.1);
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 20px;
        }

        /* Logo block */
        .cs-navbar__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          padding-right: 20px;
          border-right: 1px solid rgba(99, 179, 237, 0.12);
        }
        .cs-navbar__logo-icon {
          width: 32px; height: 32px;
          background: rgba(99, 179, 237, 0.15);
          border: 1px solid rgba(99, 179, 237, 0.3);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700;
          font-family: var(--font-display);
          color: #63b3ed;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .cs-navbar__logo-name {
          font-size: 0.85rem;
          font-family: var(--font-display);
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        /* Page title block */
        .cs-navbar__title-block {
          flex: 1;
          min-width: 0;
        }
        .cs-navbar__title {
          font-size: 1.05rem;
          font-family: var(--font-display);
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .cs-navbar__subtitle {
          font-size: 0.72rem;
          color: #475569;
          font-family: var(--font-mono);
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Right slot */
        .cs-navbar__right-slot {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* User chip + logout wrapper */
        .cs-navbar__user-section {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 16px;
          border-left: 1px solid rgba(99, 179, 237, 0.12);
          flex-shrink: 0;
        }
        .cs-navbar__chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 5px 10px 5px 6px;
        }
        .cs-navbar__avatar {
          width: 26px; height: 26px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          font-family: var(--font-display);
          flex-shrink: 0;
        }
        .cs-navbar__user-name {
          font-size: 0.78rem;
          font-weight: 500;
          color: #e2e8f0;
          line-height: 1.2;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cs-navbar__user-role {
          font-size: 0.6rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Logout button */
        .cs-navbar__logout {
          background: rgba(252, 129, 129, 0.08);
          border: 1px solid rgba(252, 129, 129, 0.2);
          border-radius: 7px;
          color: #fc8181;
          padding: 6px 12px;
          font-size: 0.78rem;
          cursor: pointer;
          font-family: var(--font-body);
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.15s, border-color 0.15s;
        }
        .cs-navbar__logout:hover {
          background: rgba(252, 129, 129, 0.18);
          border-color: rgba(252, 129, 129, 0.35);
        }
        .cs-navbar__logout:focus-visible {
          outline: 2px solid #fc8181;
          outline-offset: 2px;
        }
      `}</style>

      {/* ── Markup ── */}
      <header className="cs-navbar" role="banner">

        {/* Logo */}
        <div className="cs-navbar__logo" aria-label="Clinical Scan Support System">
          <div className="cs-navbar__logo-icon" aria-hidden="true">CS</div>
          <span className="cs-navbar__logo-name">Clinical Scan Support System</span>
        </div>

        {/* Page title */}
        <div className="cs-navbar__title-block">
          <div className="cs-navbar__title">{title}</div>
          <div className="cs-navbar__subtitle">{subtitle}</div>
        </div>

        {/* Optional right slot (search, notifications, etc.) */}
        {rightContent && (
          <div className="cs-navbar__right-slot">
            {rightContent}
          </div>
        )}

        {/* User chip + logout */}
        <div className="cs-navbar__user-section">
          <div
            className="cs-navbar__chip"
            title={displayName}
          >
            {/* Avatar with role colour */}
            <div
              className="cs-navbar__avatar"
              style={{
                background:   colors.bg,
                border:       `1px solid ${colors.border}`,
                color:        colors.color,
              }}
              aria-hidden="true"
            >
              {initials}
            </div>

            {/* Name + role badge */}
            <div>
              <div className="cs-navbar__user-name">{displayName}</div>
              <div
                className="cs-navbar__user-role"
                style={{ color: colors.color }}
              >
                {role}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            className="cs-navbar__logout"
            onClick={handleLogout}
            aria-label="Logout from system"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>

      </header>
    </>
  );
}