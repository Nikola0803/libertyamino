"use client";

import { FormEvent, useState } from "react";

interface FormState {
  name: string;
  email: string;
  branch: string;
  status: string;
}

const STATUS_OPTIONS = [
  "Active Duty Military",
  "Reserve / National Guard",
  "Honorably Discharged Veteran",
  "Law Enforcement",
  "Fire / EMS / Paramedics",
];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB per LA spec

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
      setError("File is too large — please upload something under 5 MB.");
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
      setError("Please attach proof of service (military ID, DD-214, badge, or department ID).");
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
            ? "This program is not currently accepting requests — check back soon."
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
      <div className="rounded-lg border border-border-subtle bg-white p-8 text-center">
        <i className="ri-checkbox-circle-fill text-2xl text-navy" />
        <p className="mt-3 text-lg font-semibold text-ink">Application received</p>
        <p className="mt-2 text-sm text-muted">
          We verify each application by hand within about 24 hours. If approved, your personal 15% discount
          code will arrive by email. Your uploaded credential will be deleted after review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border-subtle bg-white p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Full Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Status</label>
        <select
          required
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
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
        <label className="mb-1.5 block text-sm font-semibold text-ink">Branch / Agency</label>
        <input
          type="text"
          required
          value={form.branch}
          onChange={(e) => set("branch", e.target.value)}
          placeholder="e.g. U.S. Army, Chicago PD, County EMS"
          className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Proof of Service <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          required
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleFileChange}
          className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:text-white focus:border-navy"
        />
        <p className="mt-1.5 text-xs text-muted">
          Military/veteran ID, DD-214, or badge/department photo. JPG, PNG, or PDF, under 5 MB.
          Used only to verify eligibility — deleted after review.
        </p>
      </div>

      <p className="text-xs text-muted">
        One code per person. Not combinable with other offers. We may follow up by email to confirm eligibility.
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
        className="w-full rounded-md bg-navy py-3.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-navy-dark disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Apply for My Code"}
      </button>
    </form>
  );
}
