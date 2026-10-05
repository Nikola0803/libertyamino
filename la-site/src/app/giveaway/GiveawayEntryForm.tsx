"use client";

import { FormEvent, useState } from "react";

/**
 * The free, no-purchase-necessary entry path (AMOE). This has to stay --
 * most US states treat "pay to enter, chance, prize" as an unlicensed
 * lottery unless a genuine free alternate entry method exists alongside
 * the purchase-triggered one (see the legal note on GIVEAWAY_STATUS in
 * deal-and-giveaway.ts). It's tucked behind a small link rather than a
 * big form up front so the page still *feels* like "just order and
 * you're in" -- the auto-entry path is what's actually being marketed --
 * while the required free option stays one click away, not deleted.
 *
 * Proxied through /api/giveaway/enter server-side so the CRM's store API
 * key never reaches the browser -- same pattern as checkout and the
 * affiliate form. One entry per email per day (enforced server-side by
 * the CRM).
 */
export function GiveawayEntryForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "entered" | "already" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/giveaway/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong entering the giveaway. Please try again.");
      }
      setResult(data?.alreadyEntered ? "already" : "entered");
    } catch (err) {
      setResult("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result === "entered" || result === "already") {
    return (
      <div className="mt-4 rounded-lg border border-stone bg-white p-6 text-center">
        <i className="ri-checkbox-circle-fill text-2xl text-sage-deep" />
        <p className="mt-3 font-display text-base font-semibold text-charcoal">
          {result === "already" ? "You're already entered for today" : "You're entered!"}
        </p>
        <p className="mt-2 text-xs text-charcoal/60">
          Winners are drawn once entries close for the day. Come back tomorrow for another free entry.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 block w-full text-center text-[11px] uppercase tracking-[0.12em] text-charcoal/40 underline decoration-charcoal/20 underline-offset-2 transition hover:text-charcoal/70"
      >
        Prefer not to order? Enter free instead -- no purchase necessary
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-lg border border-stone bg-white p-6">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-charcoal">
          Email <span className="text-copper">*</span>
        </label>
        <input
          type="email"
          required
          autoFocus
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
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
        {submitting ? "Entering..." : "Enter for Free"}
      </button>

      <p className="text-center text-[11px] leading-relaxed text-charcoal/50">
        No purchase necessary. One free entry per person per day.
      </p>
    </form>
  );
}
