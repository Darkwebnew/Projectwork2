# frontend/components/ChatBot.js

import { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../services/api';

// ── Welcome message ────────────────────────────────────────────────────────────
const WELCOME = {
  from: 'bot',
  text: "👋 Hi! I'm the CSSS Medical Assistant. Ask me about scan uploads, results, workflow steps, or how to use the system.",
  category: 'greeting',
  time: Date.now(),
};

const STORAGE_KEY = 'csss_chatMsgs';

// ── Category badge config ──────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  greeting: { color: '#10b981', label: 'Greeting' },
  medical:  { color: '#e91e63', label: 'Medical'  },
  workflow: { color: '#3b82f6', label: 'Workflow' },
  auth:     { color: '#f59e0b', label: 'Auth'     },
  ai:       { color: '#a78bfa', label: 'AI'       },
  scan:     { color: '#06b6d4', label: 'Scan'     },
  result:   { color: '#6366f1', label: 'Result'   },
  support:  { color: '#64748b', label: 'Support'  },
  admin:    { color: '#ef4444', label: 'Admin'    },
  fallback: { color: '#6b7280', label: 'Help'     },
  error:    { color: '#ff5722', label: 'Error'    },
};

// ── All chatbot styles (scoped — zero changes to global CSS) ───────────────────
const styles = `
  /* ── FAB ── */
  .chatbot-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--cyan, #00d4ff);
    color: var(--bg-canvas, #0b0f1a);
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
    border: none;
    cursor: pointer;
    z-index: 1001;
    transition: background 200ms, transform 200ms, box-shadow 200ms;
  }
  .chatbot-fab:hover {
    background: #33deff;
    transform: scale(1.08);
    box-shadow: 0 6px 28px rgba(0, 212, 255, 0.55);
  }
  .chatbot-fab:focus-visible {
    outline: 2px solid var(--cyan, #00d4ff);
    outline-offset: 3px;
  }

  /* ── Window ── */
  .chatbot-window {
    position: fixed;
    bottom: 96px;
    right: 24px;
    width: 350px;
    max-height: 560px;
    background: var(--bg-panel, #111827);
    border: 1px solid var(--border-light, #2e3d57);
    border-radius: 18px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,212,255,0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1000;
    animation: cbSlideUp 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes cbSlideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* ── Header ── */
  .cb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 14px;
    background: linear-gradient(135deg, #00b8d9 0%, #0077b6 100%);
    flex-shrink: 0;
  }

  .cb-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cb-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .cb-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .cb-title-wrap {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .cb-name {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .cb-status {
    font-size: 11px;
    font-weight: 500;
    color: #b8ffdd;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cb-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2dfc98;
    box-shadow: 0 0 6px #2dfc98;
    animation: cbPulse 2s ease-in-out infinite;
    display: inline-block;
  }

  @keyframes cbPulse {
    0%, 100% { opacity: 1;    transform: scale(1);    }
    50%       { opacity: 0.6; transform: scale(1.35); }
  }

  .cb-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cb-action-btn {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 200ms;
    line-height: 1;
    padding: 0;
  }
  .cb-action-btn:hover         { background: rgba(255,255,255,0.28); }
  .cb-action-btn:focus-visible { outline: 2px solid rgba(255,255,255,0.8); outline-offset: 2px; }

  /* ── Messages area ── */
  .cb-messages {
    flex: 1;
    overflow-y: auto;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--bg-canvas, #0b0f1a);
    scrollbar-width: thin;
    scrollbar-color: var(--border-light, #2e3d57) transparent;
  }

  .cb-messages::-webkit-scrollbar       { width: 4px; }
  .cb-messages::-webkit-scrollbar-thumb { background: var(--border-light, #2e3d57); border-radius: 99px; }

  /* ── Message row ── */
  .cb-msg {
    display: flex;
    flex-direction: column;
    max-width: 84%;
    gap: 3px;
    animation: cbFadeIn 200ms ease;
  }

  @keyframes cbFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }

  .cb-msg.user { align-self: flex-end;   align-items: flex-end;   }
  .cb-msg.bot  { align-self: flex-start; align-items: flex-start; }

  /* ── Bubble ── */
  .cb-bubble {
    padding: 9px 12px;
    border-radius: 14px;
    font-size: 13.5px;
    line-height: 1.55;
    word-break: break-word;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cb-msg.bot .cb-bubble {
    background: var(--bg-surface, #1a2235);
    color: var(--text-primary, #e8edf7);
    border: 1px solid var(--border, #243049);
    border-bottom-left-radius: 4px;
  }

  .cb-msg.user .cb-bubble {
    background: linear-gradient(135deg, #00b8d9 0%, #0077b6 100%);
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  /* ── Category badge ── */
  .cb-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 7px;
    border-radius: 99px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #fff;
    width: fit-content;
    opacity: 0.92;
  }

  .cb-badge-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255,255,255,0.75);
    flex-shrink: 0;
  }

  /* ── Message text ── */
  .cb-text {
    white-space: pre-wrap;
    line-height: 1.55;
  }

  /* ── Timestamp ── */
  .cb-time {
    font-size: 10px;
    color: var(--text-muted, #4a5a72);
    padding: 0 2px;
    align-self: flex-end;
  }

  .cb-msg.user .cb-time { color: rgba(255,255,255,0.55); }

  /* ── Typing indicator ── */
  .cb-typing {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 11px 14px;
    background: var(--bg-surface, #1a2235);
    border: 1px solid var(--border, #243049);
    border-radius: 14px;
    border-bottom-left-radius: 4px;
    width: fit-content;
  }

  .cb-typing-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--cyan, #00d4ff);
    opacity: 0.35;
  }
  .cb-typing-dot:nth-child(1) { animation: cbDot 1.2s 0.0s ease-in-out infinite; }
  .cb-typing-dot:nth-child(2) { animation: cbDot 1.2s 0.2s ease-in-out infinite; }
  .cb-typing-dot:nth-child(3) { animation: cbDot 1.2s 0.4s ease-in-out infinite; }

  @keyframes cbDot {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0);    }
    30%            { opacity: 1;   transform: translateY(-5px); }
  }

  /* ── Input row ── */
  .cb-input-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 10px 12px;
    background: var(--bg-panel, #111827);
    border-top: 1px solid var(--border, #243049);
    flex-shrink: 0;
  }

  .cb-textarea {
    flex: 1;
    background: var(--bg-surface, #1a2235);
    border: 1px solid var(--border-light, #2e3d57);
    border-radius: 10px;
    color: var(--text-primary, #e8edf7);
    font-size: 13.5px;
    font-family: inherit;
    padding: 8px 12px;
    resize: none;
    overflow: hidden;
    max-height: 100px;
    line-height: 1.5;
    outline: none;
    transition: border-color 200ms, box-shadow 200ms;
  }

  .cb-textarea:focus {
    border-color: var(--cyan, #00d4ff);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  .cb-textarea::placeholder { color: var(--text-muted, #4a5a72); }
  .cb-textarea:disabled     { opacity: 0.5; cursor: not-allowed; }

  .cb-send {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--cyan, #00d4ff);
    color: var(--bg-canvas, #0b0f1a);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 200ms, transform 200ms, box-shadow 200ms;
    flex-shrink: 0;
  }

  .cb-send:hover:not(:disabled) {
    background: #33deff;
    transform: scale(1.06);
    box-shadow: 0 0 12px rgba(0,212,255,0.4);
  }

  .cb-send:disabled      { opacity: 0.35; cursor: not-allowed; }
  .cb-send:focus-visible { outline: 2px solid var(--cyan, #00d4ff); outline-offset: 2px; }

  /* ── Footer hint ── */
  .cb-footer-hint {
    text-align: center;
    font-size: 10px;
    color: var(--text-muted, #4a5a72);
    padding: 5px 0 7px;
    letter-spacing: 0.02em;
    background: var(--bg-panel, #111827);
  }

  /* ── Mobile ── */
  @media (max-width: 480px) {
    .chatbot-window {
      right: 12px;
      left: 12px;
      width: auto;
      bottom: 88px;
    }
    .chatbot-fab {
      right: 16px;
      bottom: 16px;
    }
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [WELCOME];
    } catch {
      return [WELCOME];
    }
  });
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const msgEnd                = useRef(null);
  const textareaRef           = useRef(null);

  /* Inject scoped styles once */
  useEffect(() => {
    const id = 'csss-chatbot-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = styles;
      document.head.appendChild(tag);
    }
  }, []);

  /* Persist messages */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); } catch {}
  }, [msgs]);

  /* Auto-scroll */
  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  /* Focus textarea when window opens */
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 80);
  }, [open]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setMsgs(m => [...m, { from: 'user', text: trimmed, time: Date.now() }]);
    setLoading(true);

    try {
      const res      = await chatbotAPI.send(trimmed);
      const resText  = res.data.response?.trim() || "Sorry, I didn't understand that.";
      const category = res.data.category || 'fallback';

      setMsgs(m => [...m, { from: 'bot', text: resText, category, time: Date.now() }]);
    } catch {
      setMsgs(m => [...m, {
        from: 'bot',
        text: '⚠️ Sorry, I could not process that. Please try again.',
        category: 'error',
        time: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const clearChat = () => setMsgs([{ ...WELCOME, time: Date.now() }]);

  return (
    <>
      {open && (
        <div
          className="chatbot-window"
          role="dialog"
          aria-label="CSSS Medical Assistant Chat"
          aria-modal="true"
        >
          {/* ── Header ── */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar" aria-hidden="true">
                {/* To use your logo, replace the emoji with:
                    <img src="/logo.png" alt="CSSS Logo" /> */}
                🏥
              </div>
              <div className="cb-title-wrap">
                <span className="cb-name">CSSS Assistant</span>
                <span className="cb-status">
                  <span className="cb-status-dot" aria-hidden="true" />
                  Online
                </span>
              </div>
            </div>

            <div className="cb-header-actions">
              <button
                className="cb-action-btn"
                onClick={clearChat}
                title="Clear chat history"
                aria-label="Clear chat history"
              >
                🗑
              </button>
              <button
                className="cb-action-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            className="cb-messages"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {msgs.map((m, i) => (
              <div key={i} className={`cb-msg ${m.from}`}>
                <div className="cb-bubble">

                  {/* Category badge — bot messages only */}
                  {m.from === 'bot' && m.category && (
                    <span
                      className="cb-badge"
                      style={{
                        backgroundColor: CATEGORY_CONFIG[m.category]?.color || '#6b7280',
                      }}
                      aria-label={`Category: ${CATEGORY_CONFIG[m.category]?.label || m.category}`}
                    >
                      <span className="cb-badge-dot" aria-hidden="true" />
                      {CATEGORY_CONFIG[m.category]?.label || m.category}
                    </span>
                  )}

                  {/* Message text */}
                  <span className="cb-text">{m.text}</span>

                  {/* Timestamp */}
                  {m.time && (
                    <span
                      className="cb-time"
                      aria-label={`Sent at ${formatTime(m.time)}`}
                    >
                      {formatTime(m.time)}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="cb-msg bot" aria-live="polite" aria-label="Assistant is typing">
                <div className="cb-typing">
                  <span className="cb-typing-dot" />
                  <span className="cb-typing-dot" />
                  <span className="cb-typing-dot" />
                </div>
              </div>
            )}

            <div ref={msgEnd} />
          </div>

          {/* ── Input ── */}
          <div className="cb-input-row">
            <textarea
              ref={textareaRef}
              className="cb-textarea"
              placeholder="Ask a question… (Shift+Enter for new line)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              rows={1}
              aria-label="Chat input"
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
              }}
            />
            <button
              className="cb-send"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              title="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
            </button>
          </div>

          {/* ── Footer hint ── */}
          <div className="cb-footer-hint" aria-hidden="true">
            Powered by CSSS · Enter to send
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen(o => !o)}
        title="CSSS Assistant"
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={open}
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  );
}