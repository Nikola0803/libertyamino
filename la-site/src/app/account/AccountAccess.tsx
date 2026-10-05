"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { saveAuth } from "@/lib/auth";
import { setStoredCouponCode } from "@/lib/referral";

type Mode = "signin" | "register";

type AuthPayload = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  email?: string;
  username?: string;
  name?: string;
  user_id?: string;
  id?: string;
  user?: AuthPayload;
  customer?: AuthPayload;
  data?: AuthPayload;
  error?: string;
  message?: string;
  couponCode?: string;
};

function getSession(data: AuthPayload, fallbackEmail: string) {
  const root = data.data ?? data;
  const user = root.user ?? root.customer ?? root;
  const token = root.token ?? root.accessToken ?? root.access_token;
  const email = user.email ?? root.email ?? fallbackEmail;
  const username = user.username ?? user.name ?? root.username ?? root.name ?? email.split("@")[0];
  const userId = user.user_id ?? user.id ?? root.user_id ?? root.id;
  return token && userId ? { token, email, username, user_id: userId } : null;
}

export function AccountAccess({ initialMode = "signin" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  async function request(path: string, body: Record<string, unknown>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => ({}))) as AuthPayload;
    if (!response.ok) throw new Error(data.error ?? data.message ?? "We could not complete that request. Please try again.");
    return data;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setSubmitting(true);
    try {
      let data = await request(
        mode === "signin" ? "/api/auth/login" : "/api/auth/register",
        mode === "signin" ? { email, password } : { email, password, marketingOptIn },
      );
      let session = getSession(data, email);

      if (mode === "register" && !session) {
        data = await request("/api/auth/login", { email, password });
        session = getSession(data, email);
      }
      if (!session) throw new Error("Your account response did not include a valid session. Please contact support.");

      saveAuth(session);
      if (mode === "register" && typeof data.couponCode === "string") {
        setStoredCouponCode(data.couponCode);
      }
      window.location.href = mode === "register" ? "/shop?welcome=10" : "/account";
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="px-4 py-10 md:py-16">
      <div className="mx-auto grid max-w-[1120px] overflow-hidden rounded-[24px] border border-stone bg-white shadow-[0_22px_65px_rgba(11,47,44,.10)] lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#07383a] p-8 text-white md:p-12 lg:min-h-[650px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_12%,rgba(185,217,206,.22),transparent_38%),linear-gradient(145deg,#07383a,#092825)]" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b9d9ce]">EVLV Research Account</p>
            <h1 className="mt-5 max-w-md font-display text-4xl font-semibold leading-tight md:text-5xl">Research orders and documentation in one place.</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">Sign in to review order history, saved addresses, verification status, wholesale access, and partner tools.</p>
          </div>
          <div className="relative mt-10 grid gap-4 border-t border-white/15 pt-7 text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-1">
            <span className="flex items-center gap-3"><i className="ri-file-list-3-line text-[#b9d9ce]" /> View orders and shipping status</span>
            <span className="flex items-center gap-3"><i className="ri-shield-check-line text-[#b9d9ce]" /> Manage research verification</span>
            <span className="flex items-center gap-3"><i className="ri-store-2-line text-[#b9d9ce]" /> Access wholesale partner tools</span>
          </div>
        </div>

        <div className="flex items-center p-7 sm:p-10 md:p-14">
          <div className="mx-auto w-full max-w-md">
            <div className="grid grid-cols-2 rounded-lg bg-[#f1f5f3] p-1">
              <button type="button" onClick={() => switchMode("signin")} className={`rounded-md px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition ${mode === "signin" ? "bg-white text-charcoal shadow-sm" : "text-charcoal/45"}`}>Sign In</button>
              <button type="button" onClick={() => switchMode("register")} className={`rounded-md px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition ${mode === "register" ? "bg-white text-charcoal shadow-sm" : "text-charcoal/45"}`}>Create Account</button>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-deep">{mode === "signin" ? "Welcome back" : "Create your profile"}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-charcoal">{mode === "signin" ? "Sign in to EVLV" : "Open an EVLV account"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/50">{mode === "signin" ? "Enter the email and password connected to your account." : "Create one secure login and receive 10% off your first purchase. Your personal reward is applied automatically at checkout."}</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <Field label="Email Address" type="email" value={email} onChange={setEmail} autoComplete="email" />
              <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete={mode === "signin" ? "current-password" : "new-password"} />

              {mode === "register" && (
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-charcoal/55">
                  <input type="checkbox" checked={marketingOptIn} onChange={(event) => setMarketingOptIn(event.target.checked)} className="mt-0.5 accent-[#07383a]" />
                  Send me EVLV research updates, new product notices, and occasional offers.
                </label>
              )}

              {error && <p className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700"><i className="ri-error-warning-line mt-0.5" />{error}</p>}

              <button type="submit" disabled={submitting} className="w-full rounded-md bg-[#07383a] py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0b4b4c] disabled:cursor-wait disabled:opacity-60">
                {submitting ? "Please wait..." : mode === "signin" ? "Sign In Securely" : "Create Account & Save 10%"}
              </button>
            </form>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-charcoal/40">
              By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", value, onChange, autoComplete }: { label: string; type?: string; value: string; onChange: (value: string) => void; autoComplete: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-charcoal">{label}</span>
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} className="w-full rounded-md border border-[#d6e0db] bg-white px-4 py-3 text-base text-charcoal outline-none transition placeholder:text-charcoal/25 focus:border-sage-deep focus:ring-2 focus:ring-sage-deep/10" />
    </label>
  );
}
