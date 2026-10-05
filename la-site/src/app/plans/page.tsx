"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredUser, getStoredToken, setMembershipStatus, type AuthUser, type MembershipStatus } from "@/lib/auth";

const TIERS = [
  {
    key: "standard",
    label: "Standard",
    price: "Free to join",
    body: "Full access to the shop, everything except member-only research blend formulations.",
    features: ["All standard research compounds", "Standard pricing", "Full order history & account tools"],
  },
  {
    key: "member",
    label: "Member",
    price: "By request",
    body: "Unlocks member-only research blend formulations, reviewed and granted by our team.",
    features: [
      "Everything in Standard",
      "Priority access to member-only research blend formulations (Wolverine Stack, GLOW, KLOW)",
      "Reviewed by our team, typically within a couple of business days",
    ],
  },
  {
    key: "admin",
    label: "Admin-Granted",
    price: "N/A",
    body: "Access granted manually on your profile. Ask us if you think you qualify.",
    features: ["For institutional & bulk buyers", "Granted case-by-case by our team", "Contact us to be considered"],
  },
] as const;

export default function PlansPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<MembershipStatus>("NONE");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setMounted(true);
    if (!stored || stored.user_id === "local") return;

    setLoadingStatus(true);
    fetch("/api/membership/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getStoredToken() }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.status) {
          setStatus(data.status);
          setMembershipStatus(data.status);
        }
      })
      .catch(() => {
        /* CRM unreachable, keep NONE */
      })
      .finally(() => setLoadingStatus(false));
  }, []);

  async function handleRequestMembership() {
    setRequesting(true);
    setError("");
    try {
      const res = await fetch("/api/membership/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: getStoredToken() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 503
            ? "Membership requests aren't connected yet -- check back soon, or reach out via Contact in the meantime."
            : data?.error || "Something went wrong requesting Member access."
        );
      }
      setStatus(data.status ?? "PENDING");
      setMembershipStatus(data.status ?? "PENDING");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setRequesting(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      <section className="-mt-[90px] bg-charcoal pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]">
        <div className="mx-auto max-w-[700px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Plans</p>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Choose your access.</h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Request Member access for member-only research blend formulations, or ask us to grant access manually on
            your profile.
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[1100px] px-4 md:px-8">
          {!user && (
            <div className="mb-8 rounded-lg border border-dashed border-stone bg-ivory-soft p-4 text-center text-sm text-charcoal/50">
              You&rsquo;re browsing as a guest, sign in to request Member access.
            </div>
          )}

          {error && (
            <p className="mb-6 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-red-600">
              <i className="ri-error-warning-line text-sm shrink-0" />
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TIERS.map((tier) => {
              const isCurrentMember = tier.key === "member" && status === "APPROVED";
              return (
                <div
                  key={tier.key}
                  className={`flex flex-col rounded-lg border p-6 ${isCurrentMember ? "border-copper bg-copper/5" : "border-stone bg-white"}`}
                >
                  {isCurrentMember && (
                    <span className="mb-3 w-fit rounded-full bg-copper px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-charcoal">
                      Active
                    </span>
                  )}
                  <h2 className="font-display text-xl font-semibold text-charcoal">{tier.label}</h2>
                  <p className="mt-1 text-sm font-medium text-copper">{tier.price}</p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{tier.body}</p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-charcoal/60">
                        <i className="ri-checkbox-circle-line mt-0.5 text-copper" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {tier.key === "standard" && (
                      <button
                        disabled
                        className="w-full cursor-default rounded-md border border-stone py-3 text-[11px] font-semibold uppercase tracking-wide text-charcoal/40"
                      >
                        {user ? "Included" : "Default Plan"}
                      </button>
                    )}
                    {tier.key === "member" &&
                      (!user ? (
                        <Link
                          href="/"
                          className="block w-full rounded-md bg-copper py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light"
                        >
                          Sign In to Request
                        </Link>
                      ) : status === "APPROVED" ? (
                        <button
                          disabled
                          className="w-full cursor-default rounded-md border border-stone py-3 text-[11px] font-semibold uppercase tracking-wide text-charcoal/40"
                        >
                          Active
                        </button>
                      ) : status === "PENDING" ? (
                        <button
                          disabled
                          className="w-full cursor-default rounded-md border border-stone py-3 text-[11px] font-semibold uppercase tracking-wide text-charcoal/40"
                        >
                          Request Under Review
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRequestMembership}
                          disabled={requesting || loadingStatus}
                          className="w-full rounded-md bg-copper py-3 text-[11px] font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light disabled:cursor-wait disabled:opacity-60"
                        >
                          {requesting ? "Submitting..." : status === "REJECTED" ? "Request Again" : "Request Member Access"}
                        </button>
                      ))}
                    {tier.key === "admin" && (
                      <Link
                        href="/contact"
                        className="block w-full rounded-md border border-charcoal py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-charcoal transition hover:bg-charcoal hover:text-ivory"
                      >
                        Contact Us
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {user && status === "PENDING" && (
            <p className="mt-8 text-center text-xs text-charcoal/40">
              We review every Member request by hand -- we&rsquo;ll follow up by email within a couple of business
              days.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
