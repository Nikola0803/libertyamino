'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.evlvpeptides.com';
const TRACKING_KEY = process.env.NEXT_PUBLIC_CRM_TRACKING_KEY || 'cmtzmexzs002qbeckbre23u9i';
const STORAGE_KEY = 'evlv_chat';
const POLL_INTERVAL = 4000;
const CHAT_SESSION_TTL_MS = 60 * 60 * 1000;

const C = {
  dark: '#0b2f2c',
  green: '#327657',
  ivory: '#f1eee7',
  stone: '#dce5df',
  text: '#152522',
  muted: '#697571',
  staffBubble: '#0b2f2c',
  visitorBubble: '#e7f0ea',
};

interface ChatSession {
  conversationId: string;
  chatToken: string;
  lastActiveAt: number;
}

interface Message {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  body: string;
  createdAt: string;
}

function storeChatSession(session: ChatSession) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch {}
}

function touchChatSession(session: ChatSession) {
  storeChatSession({ ...session, lastActiveAt: Date.now() });
}

function clearStoredChat() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(0);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstMsg, setFirstMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const lastSeenAt = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as Partial<ChatSession>;
      const valid = Boolean(
        stored.conversationId
        && stored.chatToken
        && stored.lastActiveAt
        && Date.now() - stored.lastActiveAt <= CHAT_SESSION_TTL_MS,
      );
      if (valid) setSession(stored as ChatSession);
      else clearStoredChat();
    } catch {}
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [messages, open]);

  const poll = useCallback(async (s: ChatSession) => {
    try {
      const params = new URLSearchParams({
        conversationId: s.conversationId,
        chatToken: s.chatToken,
        ...(lastSeenAt.current ? { after: lastSeenAt.current } : {}),
      });
      const res = await fetch(`${CRM_URL}/api/chat/messages?${params}`);
      if (res.status === 404) {
        clearStoredChat();
        setSession(null);
        setMessages([]);
        return;
      }
      if (!res.ok) return;
      touchChatSession(s);
      const data = await res.json();
      const newMsgs: Message[] = data.messages || [];
      if (newMsgs.length > 0) {
        lastSeenAt.current = newMsgs[newMsgs.length - 1].createdAt;
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const fresh = newMsgs.filter((m) => !ids.has(m.id));
          if (fresh.length === 0) return prev;
          if (!open) setUnread((u) => u + fresh.filter((m) => m.direction === 'OUTBOUND').length);
          return [...prev, ...fresh];
        });
      }
    } catch {}
  }, [open]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        const params = new URLSearchParams({ conversationId: session.conversationId, chatToken: session.chatToken });
        const res = await fetch(`${CRM_URL}/api/chat/messages?${params}`);
        if (res.status === 404) {
          clearStoredChat();
          setSession(null);
          setMessages([]);
          return;
        }
        if (res.ok) {
          touchChatSession(session);
          const data = await res.json();
          const msgs: Message[] = data.messages || [];
          setMessages(msgs);
          if (msgs.length > 0) lastSeenAt.current = msgs[msgs.length - 1].createdAt;
        }
      } catch {}
    })();
    pollRef.current = setInterval(() => poll(session), POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [session, poll]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstMsg.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${CRM_URL}/api/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: TRACKING_KEY,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          message: firstMsg.trim(),
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      const s: ChatSession = { conversationId: data.conversationId, chatToken: data.chatToken, lastActiveAt: Date.now() };
      storeChatSession(s);
      setSession(s);
      setMessages([{ id: 'init', direction: 'INBOUND', body: firstMsg.trim(), createdAt: new Date().toISOString() }]);
      setFirstMsg('');
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session) return;
    const body = input.trim();
    setInput('');
    const optimistic: Message = { id: `opt-${Date.now()}`, direction: 'INBOUND', body, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const res = await fetch(`${CRM_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: session.conversationId, chatToken: session.chatToken, message: body }),
      });
      if (res.ok) {
        touchChatSession(session);
        const data = await res.json();
        setMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...m, id: data.messageId, createdAt: data.createdAt } : m));
        lastSeenAt.current = data.createdAt;
      }
    } catch {}
  };

  const inputStyle: React.CSSProperties = {
    fontSize: '13px',
    border: `1px solid ${C.stone}`,
    borderRadius: '6px',
    padding: '8px 10px',
    outline: 'none',
    background: '#fff',
    color: C.text,
    fontFamily: 'inherit',
  };

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: '84px', left: '16px', width: '320px', maxHeight: '500px',
          zIndex: 9999, display: 'flex', flexDirection: 'column',
          borderRadius: '14px', overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(11,47,44,0.22)',
          background: C.ivory, border: `1px solid ${C.stone}`,
        }}>
          <div style={{ background: C.dark, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px', letterSpacing: '0.02em' }}>EVLV Support</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', marginTop: '1px' }}>Usually replies within a few hours</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '2px' }}
            >
              &times;
            </button>
          </div>

          {!session ? (
            <form onSubmit={handleStart} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0, lineHeight: 1.5 }}>
                Have a question? Send us a message and we&apos;ll get back to you.
              </p>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                style={inputStyle}
              />
              <input
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                type="email"
                style={inputStyle}
              />
              <input
                value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                type="tel"
                style={inputStyle}
              />
              <textarea
                value={firstMsg} onChange={(e) => setFirstMsg(e.target.value)}
                placeholder="How can we help?"
                required
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
              />
              {error && <p style={{ color: '#c0392b', fontSize: '12px', margin: 0 }}>{error}</p>}
              <button
                type="submit"
                disabled={sending || !firstMsg.trim()}
                style={{
                  background: C.dark, color: '#fff', border: 'none', borderRadius: '7px',
                  padding: '10px', fontSize: '13px', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1, fontFamily: 'inherit', letterSpacing: '0.02em',
                }}
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </form>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
                {messages.length === 0 && (
                  <p style={{ fontSize: '12px', color: C.muted, textAlign: 'center', margin: 'auto 0' }}>
                    Your message was sent. We&apos;ll reply here shortly.
                  </p>
                )}
                {messages.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.direction === 'OUTBOUND' ? 'flex-start' : 'flex-end' }}>
                    <div style={{
                      maxWidth: '82%', padding: '9px 13px', borderRadius: '10px', fontSize: '13px', lineHeight: '1.45',
                      background: m.direction === 'OUTBOUND' ? C.staffBubble : C.visitorBubble,
                      color: m.direction === 'OUTBOUND' ? '#fff' : C.text,
                    }}>
                      {m.body}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', padding: '10px 12px', borderTop: `1px solid ${C.stone}`, background: '#fff' }}>
                <input
                  value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    background: C.dark, color: '#fff', border: 'none', borderRadius: '7px',
                    padding: '8px 14px', fontSize: '12px', fontWeight: 700,
                    cursor: !input.trim() ? 'not-allowed' : 'pointer',
                    opacity: !input.trim() ? 0.45 : 1, fontFamily: 'inherit',
                  }}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating bubble — bottom LEFT, 60px */}
      <button
        onClick={() => { setOpen((o) => !o); if (!open) setUnread(0); }}
        aria-label="Open live chat"
        style={{
          position: 'fixed', bottom: '16px', left: '16px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: C.dark, border: 'none', cursor: 'pointer', zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(11,47,44,0.30)',
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: '#e74c3c', color: '#fff',
            fontSize: '10px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </>
  );
}
