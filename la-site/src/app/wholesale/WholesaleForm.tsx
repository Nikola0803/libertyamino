"use client";

import { FormEvent, useState } from "react";

interface FormState {
  programType: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  monthlyVolume: string;
  message: string;
}

const EMPTY: FormState = {
  programType: "",
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  monthlyVolume: "",
  message: "",
};

const VOLUME_OPTIONS = ["Just getting started", "Growing catalog", "High-volume / multi-SKU", "Not sure yet - let's talk"];
const PROGRAM_OPTIONS = ["Bulk Wholesale", "White Label", "Dropshipping", "Hybrid / Not sure yet"];

export function WholesaleForm() {
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
      const res = await fetch("/api/wholesale/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 503
            ? "Wholesale inquiries aren't connected yet - email us directly via Contact in the meantime."
            : data?.error || "Something went wrong submitting your inquiry."
        );
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <i className="ri-checkbox-circle-fill text-2xl text-copper" />
        <p className="mt-3 font-display text-lg font-semibold text-white">Inquiry received</p>
        <p className="mt-2 text-sm text-white/60">
          Our team reviews every partner inquiry by hand. We&apos;ll follow up by email within a couple of business days
          to discuss the right wholesale, white-label, or dropshipping path.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-white/10 bg-charcoal/40 p-6 md:p-8">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white">
          Partnership Model <span className="text-copper">*</span>
        </label>
        <select
          required
          value={form.programType}
          onChange={(e) => set("programType", e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-copper"
        >
          <option value="" style={{ color: "#0E1113" }}>
            What are you interested in?
          </option>
          {PROGRAM_OPTIONS.map((program) => (
            <option key={program} value={program} style={{ color: "#0E1113" }}>
              {program}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Company Name" required value={form.companyName} onChange={(v) => set("companyName", v)} />
        <Field label="Contact Name" required value={form.contactName} onChange={(v) => set("contactName", v)} />
        <Field label="Email" type="email" required value={form.email} onChange={(v) => set("email", v)} />
        <Field label="Phone" type="tel" required value={form.phone} onChange={(v) => set("phone", v)} />
      </div>

      <Field label="Existing Website (if any)" value={form.website} onChange={(v) => set("website", v)} placeholder="Optional" />

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white">
          Expected Order Volume <span className="text-copper">*</span>
        </label>
        <select
          required
          value={form.monthlyVolume}
          onChange={(e) => set("monthlyVolume", e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-copper"
        >
          <option value="" style={{ color: "#0E1113" }}>
            Select a range
          </option>
          {VOLUME_OPTIONS.map((v) => (
            <option key={v} value={v} style={{ color: "#0E1113" }}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white">
          Tell us about your business <span className="font-normal normal-case text-white/40">(optional)</span>
        </label>
        <textarea
          rows={4}
          maxLength={500}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="What are you looking to build - dropship, white-label, or a fully custom storefront?"
          className="w-full resize-none rounded-md border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-copper"
        />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-400">
          <i className="ri-error-warning-line text-sm shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-copper py-3.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-copper-light disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Request Partner Review"}
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
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-white">
        {label}
        {required && <span className="text-copper"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-copper"
      />
    </div>
  );
}
