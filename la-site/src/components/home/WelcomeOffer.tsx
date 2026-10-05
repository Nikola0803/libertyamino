"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { setStoredCouponCode } from "@/lib/referral";

export function WelcomeOffer() {
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error ?? "We could not create your code. Please try again.");

      const code = typeof data?.couponCode === "string" ? data.couponCode : "";
      if (!code) throw new Error("Your email was saved, but no checkout code was returned. Please contact support.");

      setStoredCouponCode(code);
      setCouponCode(code);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not create your code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="cp-welcome-offer cp-wrap" aria-labelledby="welcome-offer-heading">
      <div className="cp-welcome-offer-copy">
        <small>New researcher?</small>
        <h2 id="welcome-offer-heading">10% off your first order</h2>
        <p>Join the EVLV research list for occasional batch and product updates. We&apos;ll create your personal, single-use checkout code instantly.</p>
      </div>

      <div className="cp-welcome-offer-action">
        {couponCode ? (
          <>
            <span className="cp-welcome-offer-code" aria-label={`Your coupon code is ${couponCode}`}>{couponCode}</span>
            <Link className="cp-welcome-offer-button" href="/shop">Start Shopping <i className="ri-arrow-right-line" /></Link>
            <p className="cp-welcome-offer-success">Your code is saved and will be checked automatically at checkout.</p>
          </>
        ) : (
          <form className="cp-welcome-offer-form" onSubmit={subscribe}>
            <label htmlFor="welcome-offer-email">Email address</label>
            <div>
              <input
                id="welcome-offer-email"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
              <button className="cp-welcome-offer-button" type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Get My 10% Code"} <i className="ri-arrow-right-line" />
              </button>
            </div>
            {error && <p className="cp-welcome-offer-error" role="alert">{error}</p>}
          </form>
        )}
        <em>By submitting, you agree to receive EVLV research emails. Unsubscribe anytime. One welcome reward per account; total discounts are capped at 30%.</em>
      </div>
    </section>
  );
}
