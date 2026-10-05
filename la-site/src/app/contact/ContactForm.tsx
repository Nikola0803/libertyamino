"use client";

import { FormEvent, useState } from "react";

const TOPICS = ["Order Question", "Product Question", "Shipping & Tracking", "COAs", "Other"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong sending your message.");
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
      <div className="rounded-md border border-stone bg-ivory-soft p-6 text-center md:p-8">
        <p className="font-display text-lg font-semibold text-charcoal">Message sent</p>
        <p className="mt-2 text-sm text-charcoal/60">Thanks for reaching out. Our team typically responds within minutes during business hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-md border border-stone bg-ivory-soft p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your name" required value={name} onChange={setName} />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" required value={email} onChange={setEmail} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-charcoal">Subject</label>
        <select
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-md border border-stone bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sage-deep"
        >
          <option value="">Select a topic</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-semibold text-charcoal">Message</label>
        </div>
        <textarea
          required
          maxLength={500}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
          className="w-full resize-none rounded-md border border-stone bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sage-deep"
        />
        <div className="mt-1 text-right text-xs text-charcoal/40">Max 500 characters</div>
      </div>

      <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" type="text" name="company" />

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
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-charcoal">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-stone bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sage-deep"
      />
    </div>
  );
}
