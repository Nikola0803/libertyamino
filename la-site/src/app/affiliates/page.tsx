"use client";

import { FormEvent, useState } from "react";

const STEPS = [
  { num: "01", title: "Apply", body: "Fill out the form below with your name, email, website or social URL, and how you plan to promote Liberty Aminos." },
  { num: "02", title: "Get approved + link", body: "We review every application. Approved partners receive their tracking link, commission tier, and onboarding within 2–5 business days." },
  { num: "03", title: "Earn on every order", body: "Your link is credited for every qualifying order. Commissions are paid monthly to your preferred method." },
];

const TIERS = [
  { name: "Starter", rate: "10%", desc: "New or lower-volume partners. Great entry point with full access to assets." },
  { name: "Partner", rate: "15%", desc: "Established reach and consistent monthly referrals. Standard partner tier." },
  { name: "Pro", rate: "20%", desc: "High-volume partners with a strong, engaged audience. Negotiated individually." },
];

interface FormState {
  name: string;
  email: string;
  websiteSocial: string;
  howToPromote: string;
}

const EMPTY: FormState = { name: "", email: "", websiteSocial: "", howToPromote: "" };

function AffiliateApplyForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please agree to the terms before applying.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/affiliates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong submitting your application.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full rounded-md px-4 py-2.5 text-sm outline-none transition";
  const inputStyle = {
    border: "1px solid var(--border-subtle)",
    background: "var(--surface)",
    color: "var(--ink)",
  };

  if (submitted) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{ border: "1px solid var(--border-subtle)", background: "white" }}
      >
        <i className="ri-checkbox-circle-fill text-3xl mb-3 block" style={{ color: "var(--navy)" }} />
        <p className="font-display text-xl font-semibold mb-2" style={{ color: "var(--ink)" }}>Application received</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          We review every application individually. If there&rsquo;s a fit, we&rsquo;ll be in touch within 2–5 business days with your link and tier.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg p-6 md:p-8"
      style={{ border: "1px solid var(--border-subtle)", background: "white" }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
            Name <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
            Email <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Website or Social URL <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <input
          type="url"
          required
          placeholder="https://yoursite.com or https://instagram.com/handle"
          value={form.websiteSocial}
          onChange={(e) => set("websiteSocial", e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
          How do you plan to promote Liberty Aminos? <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <textarea
          required
          rows={4}
          placeholder="Tell us about your audience, platform, and how you'd feature our research compounds."
          value={form.howToPromote}
          onChange={(e) => set("howToPromote", e.target.value)}
          className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition resize-none"
          style={{ ...inputStyle }}
        />
      </div>

      <label
        className="flex items-start gap-2.5 text-xs leading-5"
        style={{ color: "var(--muted)" }}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <span>
          I agree to Liberty Aminos&rsquo; affiliate terms, will only promote products as research-use-only
          compounds, and will not make human-use, dosing, or treatment claims in my content.
        </span>
      </label>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <i className="ri-error-warning-line text-sm shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md py-3.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition disabled:cursor-wait disabled:opacity-60"
        style={{ background: "var(--navy)" }}
      >
        {submitting ? "Submitting…" : "Apply Now"}
      </button>
    </form>
  );
}

export default function AffiliatesPage() {
  return (
    <main style={{ background: "var(--white)" }}>
      {/* Hero */}
      <section
        className="py-20 text-white md:py-28"
        style={{ background: "var(--navy)" }}
      >
        <div className="mx-auto max-w-[900px] px-4 text-center md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Affiliate &amp; Partner Program
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Affiliate &amp; Partner Program
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65">
            Share Liberty Aminos with your audience and earn commission on every qualifying order.
            Transparent tiers. Honest products. Real research supply.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24" style={{ background: "var(--off-white)" }}>
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-center" style={{ color: "var(--navy)" }}>
            How it works
          </p>
          <h2 className="mb-10 text-center font-display text-2xl font-semibold md:text-3xl" style={{ color: "var(--ink)" }}>
            Three steps to start earning
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-lg p-6"
                style={{ background: "white", border: "1px solid var(--border-subtle)" }}
              >
                <p className="font-mono text-2xl font-bold mb-3" style={{ color: "var(--navy)" }}>
                  {step.num}
                </p>
                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--ink)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 md:py-24" style={{ background: "white" }}>
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-center" style={{ color: "var(--navy)" }}>
            Commission tiers
          </p>
          <h2 className="mb-10 text-center font-display text-2xl font-semibold md:text-3xl" style={{ color: "var(--ink)" }}>
            Simple, transparent commission rates
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-12">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-lg p-6 text-center"
                style={{ border: "1px solid var(--border-subtle)", background: "var(--surface)" }}
              >
                <p
                  className="text-4xl font-bold font-display mb-1"
                  style={{ color: "var(--navy)" }}
                >
                  {tier.rate}
                </p>
                <p className="font-semibold text-sm mb-2" style={{ color: "var(--ink)" }}>{tier.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{tier.desc}</p>
              </div>
            ))}
          </div>

          {/* Earnings calculator (static) */}
          <div
            className="rounded-lg p-6 text-center"
            style={{ background: "var(--navy-light)", border: "1px solid var(--border-subtle)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: "var(--navy)" }}>
              Example earnings
            </p>
            <p className="text-2xl font-bold mb-1" style={{ color: "var(--navy)" }}>$750/mo</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              100 orders × $50 avg order × 15% Partner rate
            </p>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-16 md:py-24" style={{ background: "var(--off-white)" }}>
        <div className="mx-auto max-w-[600px] px-4 md:px-8">
          <h2
            className="mb-2 text-center font-display text-2xl font-semibold"
            style={{ color: "var(--ink)" }}
          >
            Apply to become a partner.
          </h2>
          <p className="mb-8 text-center text-sm" style={{ color: "var(--muted)" }}>
            Every application is reviewed individually. We&rsquo;ll be in touch if there&rsquo;s a fit.
          </p>
          <AffiliateApplyForm />
        </div>
      </section>
    </main>
  );
}
