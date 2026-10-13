"use client";

import { FormEvent, useState } from "react";

interface FormState {
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  branchDepartment: string;
  serviceBadgeNumber: string;
  note: string;
}

const STATUS_OPTIONS = [
  "Active Military",
  "Veteran",
  "First Responder",
  "Law Enforcement",
  "EMS / Paramedic",
  "Fire Service",
];

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function HeroesDiscountForm() {
  const [form, setForm] = useState<FormState>({
    status: "",
    firstName: "",
    lastName: "",
    email: "",
    branchDepartment: "",
    serviceBadgeNumber: "",
    note: "",
  });
  const [credentialFile, setCredentialFile] = useState<File | null>(null);
  const [certified, setCertified] = useState(false);
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
      setError("File is too large — please upload something under 5MB.");
      e.target.value = "";
      setCredentialFile(null);
      return;
    }
    setCredentialFile(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!credentialFile) {
      setError("Please attach a credential (ID, DD-214, badge photo, or department ID).");
      return;
    }
    if (!certified) {
      setError("Please check the certification box before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const credentialDataUrl = await readFileAsDataUrl(credentialFile);
      const res = await fetch("/api/heroes-discount/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          branchDepartment: form.branchDepartment || undefined,
          serviceBadgeNumber: form.serviceBadgeNumber || undefined,
          note: form.note || undefined,
          credentialFileName: credentialFile.name,
          credentialFileType: credentialFile.type,
          credentialFileDataUrl: credentialDataUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 503
            ? "This program isn't accepting requests yet — check back soon."
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
      <div
        className="rounded-lg p-8 text-center"
        style={{ border: "1px solid var(--border-subtle)", background: "white" }}
      >
        <i className="ri-checkbox-circle-fill text-2xl" style={{ color: "var(--navy)" }} />
        <p className="mt-3 font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>
          Application received
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          We verify each application by hand. If approved, your 15% lifetime discount code will be
          emailed within ~24 hours.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 transition";
  const inputStyle = {
    border: "1px solid var(--border-subtle)",
    background: "var(--surface)",
    color: "var(--ink)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg p-6 md:p-8"
      style={{ border: "1px solid var(--border-subtle)", background: "white" }}
    >
      {/* Status */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Status <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <select
          required
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          className={inputClass}
          style={inputStyle}
        >
          <option value="">Select your status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
            First name <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
            Last name <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Email */}
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

      {/* Branch / Department (optional) */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Branch / Department <span className="font-normal text-xs" style={{ color: "var(--muted)" }}>(optional)</span>
        </label>
        <input
          type="text"
          value={form.branchDepartment}
          onChange={(e) => set("branchDepartment", e.target.value)}
          placeholder="e.g. U.S. Army, Chicago PD, County EMS"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Service / Badge number (optional) */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Service / Badge number <span className="font-normal text-xs" style={{ color: "var(--muted)" }}>(optional)</span>
        </label>
        <input
          type="text"
          value={form.serviceBadgeNumber}
          onChange={(e) => set("serviceBadgeNumber", e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Credential upload */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Credential <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <input
          type="file"
          required
          accept="image/jpeg,image/png,.pdf"
          onChange={handleFileChange}
          className="w-full rounded-md border px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase"
          style={{
            borderColor: "var(--border-subtle)",
            background: "var(--surface)",
            color: "var(--ink)",
          }}
        />
        <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
          Military/veteran ID, DD-214, department badge or ID photo. JPG, PNG, or PDF — under 5MB.
          Used only to verify eligibility; deleted after review.
        </p>
      </div>

      {/* Note (optional) */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Note <span className="font-normal text-xs" style={{ color: "var(--muted)" }}>(optional)</span>
        </label>
        <textarea
          rows={3}
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="Any context that helps with verification"
          className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition resize-none"
          style={{
            border: "1px solid var(--border-subtle)",
            background: "var(--surface)",
            color: "var(--ink)",
          }}
        />
      </div>

      {/* Certification checkbox */}
      <label className="flex items-start gap-2.5 text-xs leading-5" style={{ color: "var(--muted)" }}>
        <input
          type="checkbox"
          checked={certified}
          onChange={(e) => setCertified(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <span>
          I certify that I am eligible for this discount and that the information and credential
          I have provided are accurate. I understand that Liberty Aminos products are for research
          use only and not for human consumption.
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
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
