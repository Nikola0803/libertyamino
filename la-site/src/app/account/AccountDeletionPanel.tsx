"use client";

import { useEffect, useState } from "react";
import { getStoredToken } from "@/lib/auth";

type Status = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

// "Danger zone" section on the Profile tab -- lets a customer request
// their account/personal data be removed. Reviewed by hand from the CRM's
// /account-deletion page (same manual-approval pattern as Membership /
// Verification). Approving there anonymizes the Contact but keeps Order
// records for accounting, so this never promises instant/automatic
// deletion.
export function AccountDeletionPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setStatus("NONE");
      return;
    }
    fetch("/api/account/delete-request-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((d) => setStatus(d?.status ?? "NONE"))
      .catch(() => setStatus("NONE"));
  }, []);

  async function requestDeletion() {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/account/delete-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: getStoredToken() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      setStatus(data?.status ?? "PENDING");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === null) return null;

  return (
    <div className="mt-8 max-w-md rounded-lg border border-red-200 bg-red-50/40 p-6">
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-700">Danger Zone</h3>
      <p className="text-sm text-charcoal/70">Request removal of your account and personal data.</p>

      {status === "NONE" && (
        <>
          <p className="mt-2 text-[11px] leading-relaxed text-charcoal/50">
            We review every request by hand. Order records are kept in anonymized form for accounting purposes as
            required by law.
          </p>
          <button
            type="button"
            onClick={requestDeletion}
            disabled={submitting}
            className="mt-4 rounded-md border border-red-300 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-700 transition hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Request Account Removal"}
          </button>
        </>
      )}

      {status === "PENDING" && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-charcoal/70">
          <i className="ri-time-line text-copper" /> Request under review. We&apos;ll email you once it&apos;s processed.
        </p>
      )}

      {status === "APPROVED" && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-charcoal/70">
          <i className="ri-checkbox-circle-line text-sage-deep" /> Your account removal request has been processed.
        </p>
      )}

      {status === "REJECTED" && (
        <p className="mt-3 text-sm text-charcoal/70">
          We weren&apos;t able to process your removal request. Contact support if you think this was a mistake.
        </p>
      )}

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600">
          <i className="ri-error-warning-line text-sm shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
