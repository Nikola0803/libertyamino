"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { saveAuth } from "@/lib/auth";
import { trackEvent } from "@/lib/pixel";
import { Logo } from "@/components/ui/Logo";
import { captureAttributionFromUrl, getStoredAttribution } from "@/lib/campaign-attribution";

const SESSION_KEY = "evlv_research_access_v7";
const ACCESS_KEY = "evlv_research_access_v7";
const ACCESS_TTL_DAYS = 30;

const CAMPAIGN_PARAM = "age_verified";
const CAMPAIGN_SESSION_KEY = "evlv_campaign_entry";
type Mode = "signin" | "register";
type AuthPayload = { token?: string; accessToken?: string; access_token?: string; email?: string; username?: string; name?: string; user_id?: string; id?: string; user?: AuthPayload; customer?: AuthPayload; data?: AuthPayload; error?: string; message?: string; couponCode?: string };

function rememberAccess(source: "account" | "campaign") {
  localStorage.setItem(ACCESS_KEY, JSON.stringify({ ts: Date.now(), source }));
  sessionStorage.setItem(SESSION_KEY, "1");
  if (source === "campaign") sessionStorage.setItem(CAMPAIGN_SESSION_KEY, "1");
}

function getSession(data: AuthPayload, fallbackEmail: string) {
  const root = data.data ?? data;
  const user = root.user ?? root.customer ?? root;
  const token = root.token ?? root.accessToken ?? root.access_token;
  const email = user.email ?? root.email ?? fallbackEmail;
  const username = user.username ?? user.name ?? root.username ?? root.name ?? email.split("@")[0];
  const userId = user.user_id ?? user.id ?? root.user_id ?? root.id;
  return token && userId ? { token, email, username, user_id: userId } : null;
}
function hasStoredAccess() {
  if (sessionStorage.getItem(SESSION_KEY) === "1") return true;
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw) as { ts?: number };
    return typeof ts === "number" && Date.now() - ts < ACCESS_TTL_DAYS * 864e5;
  } catch { return false; }
}
export function AgeGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [campaignMode, setCampaignMode] = useState(false);
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const attribution = captureAttributionFromUrl(url);
    const isLocalPreview = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    const forcePreview = url.searchParams.get("gate_preview") === "1";
    const campaign = url.searchParams.get(CAMPAIGN_PARAM) === "1";
    if (campaign) sessionStorage.setItem(CAMPAIGN_SESSION_KEY, "1");
    const allowed = forcePreview ? false : isLocalPreview && !campaign ? true : hasStoredAccess();
    if (!allowed) {
      trackEvent("research_gate_view", {
        gate_type: campaign ? "campaign" : "account",
        campaign: attribution?.campaign,
        source: attribution?.source,
      });
    }
    queueMicrotask(() => { setCampaignMode(campaign); setAccepted(allowed); setReady(true); });
  }, []);

  useEffect(() => {
    if (!ready || accepted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!campaignMode) emailRef.current?.focus();
    return () => { document.body.style.overflow = previous; };
  }, [ready, accepted, campaignMode, mode]);

  function stripCampaignParam() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(CAMPAIGN_PARAM)) return;
    url.searchParams.delete(CAMPAIGN_PARAM);
    const query = url.searchParams.toString();
    window.history.replaceState({}, "", `${url.pathname}${query ? `?${query}` : ""}${url.hash}`);
  }

  function acceptCampaign(destination?: string) {
    if (!confirmed) {
      setError("Please confirm the research-use requirements before entering.");
      return;
    }
    rememberAccess("campaign");
    const attribution = getStoredAttribution();
    trackEvent("research_gate_accept", { gate_type: "campaign", campaign: attribution?.campaign, source: attribution?.source });
    stripCampaignParam();
    setAccepted(true);
    if (destination) window.location.assign(destination);
  }

  function switchMode(next: Mode) {
    setMode(next); setError(""); setPassword(""); setShowPassword(false); setConfirmed(false);
  }

  async function request(path: string, body: Record<string, unknown>) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await response.json().catch(() => ({}))) as AuthPayload;
    if (!response.ok) throw new Error(data.error ?? data.message ?? "We could not complete that request. Please try again.");
    return data;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!confirmed) return setError("Confirm that you are 21 or older and agree to the research-only terms.");
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    setSubmitting(true);
    try {
      let data = await request(mode === "signin" ? "/api/auth/login" : "/api/auth/register", mode === "signin" ? { email, password } : { email, password, marketingOptIn });
      let session = getSession(data, email);
      if (mode === "register" && !session) { data = await request("/api/auth/login", { email, password }); session = getSession(data, email); }
      if (!session) throw new Error("Your account response did not include a valid session. Please contact support.");
      saveAuth(session);
      rememberAccess("account");
      trackEvent("research_gate_accept", { gate_type: "account", account_action: mode });
      setAccepted(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  }

  return <>
    {children}
    {ready && !accepted && (campaignMode ? (
      <div className="cp-ruo-gate cp-ruo-gate-simple" role="dialog" aria-modal="true" aria-labelledby="cp-ruo-title" aria-describedby="cp-ruo-description">
        <section className="cp-ruo-entry-card cp-ruo-entry-card-campaign">
          <div className="cp-ruo-entry-brand"><Logo tone="charcoal" /></div>
          <p className="cp-ruo-entry-kicker"><i className="ri-shield-check-line" /> Verified Research Access</p>
          <h2 id="cp-ruo-title">Before you enter</h2>
          <p id="cp-ruo-description">EVLV supplies products exclusively for qualified laboratory and analytical research. Your campaign selection will remain available after entry.</p>
          <label className="cp-ruo-entry-check">
            <input type="checkbox" checked={confirmed} onChange={(event) => { setConfirmed(event.target.checked); setError(""); }} />
            <span>I confirm that I am 21 or older and a qualified professional. I understand these products are for in-vitro research only—not for human consumption, clinical, or veterinary use—and I accept the <Link href="/terms" target="_blank" rel="noreferrer">Terms &amp; Conditions</Link>.</span>
          </label>
          {error && <p className="cp-ruo-entry-error"><i className="ri-error-warning-line" /> {error}</p>}
          <button className="cp-ruo-entry-primary" type="button" onClick={() => acceptCampaign()}>Accept &amp; Enter</button>
          <p className="cp-ruo-entry-footnote">Campaign access skips account setup for a faster shopping experience.</p>
        </section>
      </div>
    ) : (
      <div className="cp-ruo-gate" role="dialog" aria-modal="true" aria-labelledby="cp-ruo-title" aria-describedby="cp-ruo-description">
        <div className="cp-ruo-gate-card">
          <aside className="cp-ruo-gate-media">
            <img src="/images/certified/evlv-hero-multi-vials.png" alt="EVLV premium research peptide vials and cartons" />
            <div className="cp-ruo-gate-media-overlay" />
            <div className="cp-ruo-gate-brand"><p>Verified Research Access</p><Logo tone="ivory" /><span>Premium Research Peptides</span></div>
            <div className="cp-ruo-gate-proof">
              <span><i className="ri-checkbox-circle-fill" /> Product-Specific Reports Clearly Labeled</span>
              <span><i className="ri-checkbox-circle-fill" /> Transparent Batch Documentation</span>
              <span><i className="ri-checkbox-circle-fill" /> Public COA Library</span>
            </div>
            <p className="cp-ruo-gate-restriction">Access to product information is restricted to account holders who confirm the research-only terms.</p>
          </aside>
          <section className="cp-ruo-gate-content">
            <div className="cp-ruo-gate-tabs" role="tablist" aria-label="Research account access">
              <button type="button" role="tab" aria-selected={mode === "signin"} onClick={() => switchMode("signin")}>Sign In</button>
              <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => switchMode("register")}>Create Account</button>
            </div>
            <div className="cp-ruo-gate-body">
              <h2 id="cp-ruo-title">{mode === "register" ? "Create your account" : "Welcome back"}</h2>
              <p id="cp-ruo-description">{mode === "register" ? "Create a secure research account and receive 10% off your first purchase." : "Sign in to access product information, order history, and batch-level COAs."}</p>
              <form className="cp-ruo-gate-form" onSubmit={handleSubmit}>
                <label><span>Email Address</span><input ref={emailRef} required type="email" inputMode="email" placeholder="you@lab.edu" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
                <label><span>Password</span><span className="cp-ruo-password-field"><input required minLength={8} type={showPassword ? "text" : "password"} placeholder={mode === "register" ? "Min. 8 characters" : "Enter your password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button></span></label>
                <div className="cp-ruo-gate-compliance">
                  <strong><i className="ri-shield-check-line" /> Research Use Only</strong>
                  <label className="cp-ruo-gate-check">
                    <input type="checkbox" checked={confirmed} onChange={(event) => { setConfirmed(event.target.checked); setError(""); }} />
                    <span>I confirm I am 21+ and a qualified professional. Products are for in-vitro laboratory research only, not for human consumption, clinical, or veterinary use. I accept the <Link href="/terms" target="_blank" rel="noreferrer">Terms &amp; Conditions</Link>.</span>
                  </label>
                  {mode === "register" && <label className="cp-ruo-gate-marketing">
                    <input type="checkbox" checked={marketingOptIn} onChange={(event) => setMarketingOptIn(event.target.checked)} />
                    <span>Email me research updates, new product notices, and occasional offers. I may unsubscribe at any time.</span>
                  </label>}
                </div>
                {error && <p className="cp-ruo-gate-error"><i className="ri-error-warning-line" /> {error}</p>}
                <button className="cp-ruo-gate-submit" type="submit" disabled={submitting}>{submitting ? "Please wait..." : mode === "register" ? "Create Account & Save 10%" : "Sign In & Enter"}</button>
              </form>
              <button className="cp-ruo-gate-switch" type="button" onClick={() => switchMode(mode === "register" ? "signin" : "register")}>{mode === "register" ? "Already have an account? Sign in" : "Need an account? Create account"}</button>
            </div>
            <footer className="cp-ruo-gate-footer"><b>EVLV</b><span>An account is required to access product information. New accounts receive one personal 10% first-purchase reward.</span></footer>
          </section>
        </div>
      </div>
    ))}
  </>;
}
