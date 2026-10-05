"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getStoredToken } from "@/lib/auth";

// The public application stays intentionally short. Shipping details for
// merchandise are collected privately after a partner is approved.
const SHIP_COUNTRY = "US";

interface FormState {
  name: string;
  email: string;
  referredBy: string;
  socialLink: string;
  phone: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  referredBy: "",
  socialLink: "",
  phone: "",
};

/**
 * Applies for affiliate status. If the applicant is already signed in
 * (getStoredToken() is non-empty for a real account, not the AgeGate's
 * placeholder "local" user), their existing account/order history carries
 * over server-side -- but signing in first is NOT required, since most
 * ambassador applicants on this public page have never shopped yet. Name +
 * email collected here upsert (or reuse) their Contact record; see
 * AFFILIATE-PORTAL.md.
 */
export function AffiliateForm({ onApplied }: { onApplied?: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("You must accept the Terms & Conditions to apply.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: getStoredToken(),
          name: form.name.trim(),
          email: form.email.trim(),
          referredBy: form.referredBy.trim() || undefined,
          socialLink: form.socialLink.trim(),
          phone: form.phone.trim(),
          country: SHIP_COUNTRY,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 503
            ? "The affiliate program isn't accepting applications yet - check back soon, or reach out via Contact in the meantime."
            : data?.error || "Something went wrong submitting your application."
        );
      }
      setSubmitted(true);
      onApplied?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white p-8 text-center text-[#102d28] md:p-10">
        <i className="ri-checkbox-circle-fill text-3xl text-[#356f60]" />
        <p className="mt-4 font-display text-2xl font-semibold">Application received</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#52645f]">
          Our partnerships team will review your submission. If there is a strong fit, we&apos;ll contact you directly with the next step.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/14 bg-white p-6 text-[#102d28] shadow-[0_24px_80px_rgba(0,0,0,.16)] md:p-9">
      <div className="border-b border-[#dce5e1] pb-6">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#64897f]">Partner application</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.025em]">Start the conversation.</h3>
        <p className="mt-2 text-sm leading-6 text-[#60706b]">Share your primary channel and the best way for our team to reach you.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" required value={form.name} onChange={(v) => set("name", v)} />
        <Field label="Email" type="email" required value={form.email} onChange={(v) => set("email", v)} />
      </div>

      <Field label="Who referred you?" value={form.referredBy} onChange={(v) => set("referredBy", v)} placeholder="Name or organization (optional)" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Primary Channel or Website"
          required
          value={form.socialLink}
          onChange={(v) => set("socialLink", v)}
          placeholder="https://instagram.com/yourhandle"
        />
        <Field label="Phone" type="tel" required value={form.phone} onChange={(v) => set("phone", v)} placeholder="Best direct number" />
      </div>

      <label className="flex items-start gap-2.5 border-t border-[#dce5e1] pt-5 text-xs leading-5 text-[#60706b]">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#16483f]"
        />
        <span>
          I accept the{" "}
          <Link href="/terms" className="font-semibold text-[#16483f] underline underline-offset-2">
            Terms &amp; Conditions
          </Link>
          .
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
        className="min-h-14 w-full rounded-lg bg-[#102d28] px-6 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#19483f] disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  className = "",
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.09em] text-[#355f55]">
        {label}
        {required && <span className="text-[#64897f]"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-lg border border-[#cedbd6] bg-[#f7f7f3] px-4 text-sm outline-none transition placeholder:text-[#8b9994] focus:border-[#356f60] focus:bg-white focus:ring-2 focus:ring-[#b9d9ce]/35"
      />
    </div>
  );
}
