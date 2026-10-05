"use client";

import { FormEvent, useState } from "react";

interface FormState {
  name: string;
  email: string;
  branch: string;
  status: string;
}

const STATUS_OPTIONS = ["Active Duty", "Veteran", "Reservist / National Guard", "First Responder (Police/Fire/EMS)"];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function HeroesDiscountForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", branch: "", status: "" });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError("");
    if (file && file.size > MAX_FILE_BYTES) {
      setError("File is too large - please upload something under 8MB.");
      e.target.value = "";
      setProofFile(null);
      return;
    }
    setProofFile(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!proofFile) {
      setError("Please attach proof of service (ID, discharge paperwork, or a badge/department photo).");
      return;
    }
    setSubmitting(true);
    try {
      const proofDataUrl = await readFileAsDataUrl(proofFile);
      const res = await fetch("/api/heroes-discount/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          proofFileName: proofFile.name,
          proofFileType: proofFile.type,
          proofFileDataUrl: proofDataUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 503
            ? "This program isn't accepting requests yet - check back soon."
            : data?.error || "Something went wrong submitting your request."
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
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-checkbox-circle-fill text-2xl text-sage-deep" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Request received</p>
        <p className="mt-2 text-sm text-charcoal/60">
          We verify each request by hand. If approved, your one-time 20% code will be emailed to you within a couple
          of business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-stone bg-white p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Full Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-charcoal">Status</label>
        <select
          required
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
        >
          <option value="">Select one</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-charcoal">Branch / Agency</label>
        <input
          type="text"
          required
          value={form.branch}
          onChange={(e) => set("branch", e.target.value)}
          placeholder="e.g. U.S. Army, Chicago PD, County EMS"
          className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-charcoal">
          Proof of Service <span className="text-copper">*</span>
        </label>
        <input
          type="file"
          required
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-copper file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:text-charcoal focus:border-copper"
        />
        <p className="mt-1.5 text-xs text-charcoal/40">
          Military/veteran ID, DD-214, or a department badge/ID photo. Image or PDF, under 8MB. Used only to verify
          eligibility.
        </p>
      </div>

      <p className="text-xs text-charcoal/50">
        We may follow up by email to verify eligibility before issuing a code. One code per person, not combinable
        with other offers.
      </p>

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
        {submitting ? "Submitting..." : "Request My Code"}
      </button>
    </form>
  );
}
