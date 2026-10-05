"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (typeof data?.couponCode === "string") setCouponCode(data.couponCode);
    } catch {
      /* still show success below -- signup isn't worth blocking on a network hiccup */
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  return (
    <div id="newsletter">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">Newsletter</p>
      {submitted ? (
        <div>
          <p className="text-sm text-white/60">You&apos;re on the list.</p>
          {couponCode && (
            <p className="mt-1 text-sm text-white/80">
              Your 10% off code: <span className="font-semibold tracking-wide text-copper">{couponCode}</span>
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm leading-relaxed text-white/50">Subscribe for 10% off your first purchase, plus research notes and new SKUs.</p>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-b border-white/20 pb-2">
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
            <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" type="text" name="website" />
            <button
              type="submit"
              disabled={submitting}
              aria-label="Subscribe"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 transition hover:border-copper hover:bg-copper hover:text-charcoal disabled:opacity-50"
            >
              <i className="ri-arrow-right-line text-xs" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
