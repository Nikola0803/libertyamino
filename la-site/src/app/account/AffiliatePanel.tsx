"use client";

import { useEffect, useState } from "react";
import { getStoredToken } from "@/lib/auth";
import { AffiliateForm } from "@/app/ambassadors/AffiliateForm";
import { PayoutSettings, type PayoutInfo } from "./PayoutSettings";

type AffiliateStatus = "NONE" | "PENDING" | "APPROVED";

interface DashboardData extends PayoutInfo {
  status: AffiliateStatus;
  referralCode?: string;
  clicks30d?: number;
  clicksTotal?: number;
  salesConfirmed?: number;
  salesPending?: number;
  commissionAvailableCents?: number;
  commissionPendingCents?: number;
  minPayoutCents?: number;
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const PAYOUT_LABELS: Record<NonNullable<PayoutInfo["payoutMethod"]>, string> = {
  venmo: "Venmo",
  zelle: "Zelle",
  cashapp: "Cash App",
  bank_ach: "Bank Transfer (ACH)",
};

export function AffiliatePanel() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestMsg, setRequestMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function load() {
    setLoading(true);
    setError("");
    fetch("/api/affiliate/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getStoredToken() }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || "Couldn't load your affiliate status.");
        setData(body);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load your affiliate status."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const referralLink = data?.referralCode ? `https://evlvpeptides.com/?ref=${data.referralCode}` : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable, link is still visible to copy manually */
    }
  }

  async function requestPayout() {
    setRequestMsg(null);
    setRequesting(true);
    try {
      const res = await fetch("/api/affiliate/payout-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: getStoredToken() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || "Couldn't request a payout.");
      setRequestMsg({ text: `Payout of ${money(body.amountCents ?? data?.commissionAvailableCents ?? 0)} requested.`, ok: true });
    } catch (err) {
      setRequestMsg({ text: err instanceof Error ? err.message : "Couldn't request a payout.", ok: false });
    } finally {
      setRequesting(false);
    }
  }

  if (loading) return <p className="text-sm text-charcoal/50">Loading your affiliate status…</p>;

  if (error) {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-information-line text-2xl text-charcoal/30" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Affiliate status not available yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">{error}</p>
      </div>
    );
  }

  if (!data || data.status === "NONE") {
    return (
      <div>
        <div className="mb-6 rounded-lg border border-stone bg-ivory-soft p-6">
          <p className="font-display text-lg font-semibold text-charcoal">Become an EVLV Affiliate</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Earn commission referring researchers and labs to EVLV. Applications are reviewed by hand, typically
            within a couple of business days.
          </p>
        </div>
        <AffiliateForm onApplied={load} />
      </div>
    );
  }

  if (data.status === "PENDING") {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-time-line text-2xl text-copper" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Application under review</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">
          We review every affiliate application by hand. You&apos;ll get an email once a decision is made - usually
          within a couple of business days.
        </p>
      </div>
    );
  }

  // APPROVED
  return (
    <div>
      <div className="mb-8 rounded-lg border border-stone bg-white p-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">Your Referral Link</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 truncate rounded-md bg-ivory px-4 py-2.5 text-sm text-charcoal">{referralLink}</code>
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-md bg-copper px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light"
          >
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="Clicks (30d)" value={String(data.clicks30d ?? 0)} />
        <StatCard label="Total Clicks" value={String(data.clicksTotal ?? 0)} />
        <StatCard label="Confirmed Sales" value={String(data.salesConfirmed ?? 0)} />
        <StatCard label="Pending Sales" value={String(data.salesPending ?? 0)} />
        <StatCard label="Available Commission" value={money(data.commissionAvailableCents ?? 0)} accent />
        <StatCard label="Pending Commission" value={money(data.commissionPendingCents ?? 0)} />
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-lg border border-stone bg-white p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-base font-semibold text-charcoal">Withdraw Your Earnings</p>
          <p className="mt-1 text-xs text-charcoal/50">
            Minimum payout: {money(data.minPayoutCents ?? 0)} · Sent via {data.payoutMethod ? PAYOUT_LABELS[data.payoutMethod] : "N/A"}
          </p>
          {requestMsg && <p className={`mt-2 text-xs font-medium ${requestMsg.ok ? "text-sage-deep" : "text-red-600"}`}>{requestMsg.text}</p>}
        </div>
        <button
          type="button"
          onClick={requestPayout}
          disabled={requesting || !data.payoutMethod || (data.commissionAvailableCents ?? 0) < (data.minPayoutCents ?? 0)}
          className="shrink-0 rounded-md bg-copper px-6 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          {requesting ? "Requesting..." : "Request Payout"}
        </button>
      </div>

      <div className="mt-8">
        <PayoutSettings
          initial={{
            payoutMethod: data.payoutMethod,
            payoutDestination: data.payoutDestination,
            bankAccountHolder: data.bankAccountHolder,
            bankRoutingNumber: data.bankRoutingNumber,
            bankAccountNumber: data.bankAccountNumber,
            bankAccountType: data.bankAccountType,
          }}
          onSaved={(info) => setData((d) => (d ? { ...d, ...info } : d))}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-stone bg-white p-6">
      <p className={`font-display text-2xl font-semibold ${accent ? "text-copper" : "text-charcoal"}`}>{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal/50">{label}</p>
    </div>
  );
}
