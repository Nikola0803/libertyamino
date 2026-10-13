"use client";

import { useState } from "react";
import { getStoredToken } from "@/lib/auth";

export type PayoutMethod = "venmo" | "zelle" | "cashapp" | "bank_ach";

export interface PayoutInfo {
  payoutMethod: PayoutMethod | null;
  payoutDestination: string | null;
  bankAccountHolder: string | null;
  bankRoutingNumber: string | null;
  bankAccountNumber: string | null;
  bankAccountType: "checking" | "savings" | null;
}

const METHODS: { id: PayoutMethod; label: string; icon: string }[] = [
  { id: "venmo", label: "Venmo", icon: "ri-smartphone-line" },
  { id: "zelle", label: "Zelle", icon: "ri-bank-line" },
  { id: "cashapp", label: "Cash App", icon: "ri-money-dollar-circle-line" },
  { id: "bank_ach", label: "US Bank Transfer (ACH)", icon: "ri-bank-card-line" },
];

export function PayoutSettings({ initial, onSaved }: { initial: PayoutInfo; onSaved: (info: PayoutInfo) => void }) {
  const [method, setMethod] = useState<PayoutMethod | null>(initial.payoutMethod);
  const [destination, setDestination] = useState(initial.payoutDestination ?? "");
  const [accountHolder, setAccountHolder] = useState(initial.bankAccountHolder ?? "");
  const [routingNumber, setRoutingNumber] = useState(initial.bankRoutingNumber ?? "");
  const [accountNumber, setAccountNumber] = useState(initial.bankAccountNumber ?? "");
  const [accountType, setAccountType] = useState<"checking" | "savings">(initial.bankAccountType ?? "checking");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setSaved(false);
    if (!method) {
      setError("Choose a payout method.");
      return;
    }
    if (method !== "bank_ach" && !destination.trim()) {
      setError("Enter your handle/account for that payout method.");
      return;
    }
    if (method === "bank_ach" && (!accountHolder.trim() || !routingNumber.trim() || !accountNumber.trim())) {
      setError("Fill in all bank transfer fields.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/affiliate/payout-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: getStoredToken(),
          payoutMethod: method,
          payoutDestination: method !== "bank_ach" ? destination.trim() : undefined,
          bankAccountHolder: method === "bank_ach" ? accountHolder.trim() : undefined,
          bankRoutingNumber: method === "bank_ach" ? routingNumber.trim() : undefined,
          bankAccountNumber: method === "bank_ach" ? accountNumber.trim() : undefined,
          bankAccountType: method === "bank_ach" ? accountType : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Couldn't save your payout info.");
      setSaved(true);
      onSaved({
        payoutMethod: method,
        payoutDestination: method !== "bank_ach" ? destination.trim() : null,
        bankAccountHolder: method === "bank_ach" ? accountHolder.trim() : null,
        bankRoutingNumber: method === "bank_ach" ? routingNumber.trim() : null,
        bankAccountNumber: method === "bank_ach" ? accountNumber.trim() : null,
        bankAccountType: method === "bank_ach" ? accountType : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your payout info.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border-subtle bg-white p-6">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Payout Method</p>
      <p className="mb-4 text-xs text-muted">Where should we send your commission when you request a payout?</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`flex flex-col items-center gap-2 rounded-md border px-3 py-4 text-xs font-medium transition ${
              method === m.id ? "border-copper bg-navy/10 text-ink" : "border-border-subtle text-muted hover:border-copper/60"
            }`}
          >
            <i className={`${m.icon} text-lg ${method === m.id ? "text-navy" : "text-muted"}`} />
            {m.label}
          </button>
        ))}
      </div>

      {method && method !== "bank_ach" && (
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            {method === "venmo" ? "Venmo Username" : method === "zelle" ? "Zelle Email or Phone" : "Cash App $Cashtag"}
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={method === "venmo" ? "@your-username" : method === "zelle" ? "you@example.com" : "$YourCashtag"}
            className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>
      )}

      {method === "bank_ach" && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-ink">Account Holder Name</label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Routing Number</label>
            <input
              type="text"
              inputMode="numeric"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Account Number</label>
            <input
              type="text"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Account Type</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as "checking" | "savings")}
              className="w-full rounded-md border border-border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-navy"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-red-600">
          <i className="ri-error-warning-line text-sm shrink-0" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !method}
        className="mt-5 rounded-md bg-navy px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition hover:bg-navy-light disabled:cursor-wait disabled:opacity-60"
      >
        {saving ? "Saving..." : saved ? "Saved" : "Save Payout Method"}
      </button>
    </div>
  );
}
