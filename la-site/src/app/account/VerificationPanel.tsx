"use client";

import { FormEvent, useEffect, useState } from "react";
import { getStoredToken, setResearcherStatus, type ResearcherStatus } from "@/lib/auth";

interface FormState {
  institution: string;
  role: string;
  phone: string;
  purpose: string;
}

const EMPTY: FormState = { institution: "", role: "", phone: "", purpose: "" };

export function VerificationPanel() {
  const [status, setStatus] = useState<ResearcherStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    setError("");
    fetch("/api/verification/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getStoredToken() }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || "Couldn't load your verification status.");
        setStatus(body.status ?? "NONE");
        if (body.status) setResearcherStatus(body.status);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load your verification status."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-sm text-charcoal/50">Loading your verification status…</p>;

  if (error) {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-information-line text-2xl text-charcoal/30" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Verification not available yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">{error}</p>
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div className="rounded-lg border border-sage-deep/30 bg-sage-mist p-8 text-center">
        <i className="ri-shield-check-fill text-2xl text-sage-deep" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Verified Researcher</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">
          Your account has verified researcher/institutional access. Restricted formats - nasal delivery and
          multi-dose cartridge formats - are unlocked across the shop.
        </p>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-time-line text-2xl text-copper" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Application under review</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">
          We review every verification request by hand, typically within a couple of business days. You&apos;ll get
          an email once a decision is made.
        </p>
      </div>
    );
  }

  return <VerificationForm onApplied={load} />;
}

function VerificationForm({ onApplied }: { onApplied: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: getStoredToken(), ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 503
            ? "Verification requests aren't connected yet - check back soon."
            : data?.error || "Something went wrong submitting your request."
        );
      }
      setSubmitted(true);
      onApplied();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-checkbox-circle-fill text-2xl text-sage-deep" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Request received</p>
        <p className="mt-2 text-sm text-charcoal/60">
          We review every request by hand, typically within a couple of business days.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 rounded-lg border border-stone bg-ivory-soft p-6">
        <p className="font-display text-lg font-semibold text-charcoal">Verified Researcher / Institutional Access</p>
        <p className="mt-2 text-sm text-charcoal/60">
          Some formats - nasal delivery and multi-dose cartridge formats - are restricted to accounts with
          verified researcher or institutional status. Tell us a bit about your work and we&apos;ll review your
          request by hand.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-stone bg-white p-6 md:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">
              Institution / Company <span className="text-copper">*</span>
            </label>
            <input
              type="text"
              required
              value={form.institution}
              onChange={(e) => set("institution", e.target.value)}
              className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">
              Your Role / Title <span className="text-copper">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lab Manager, PI, Research Associate"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">
            Phone <span className="text-copper">*</span>
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">
            Research Purpose <span className="text-copper">*</span>
          </label>
          <textarea
            required
            rows={4}
            maxLength={500}
            placeholder="What are you researching, and why does it call for a restricted format?"
            value={form.purpose}
            onChange={(e) => set("purpose", e.target.value)}
            className="w-full resize-none rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
            <i className="ri-error-warning-line text-sm shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-copper py-3.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-copper-light disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}
