"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredToken } from "@/lib/auth";

type WholesaleStatus = "NONE" | "PENDING" | "APPROVED";

interface Invoice {
  id: string;
  label: string;
  amountCents: number;
  status: "UNPAID" | "PAID";
  issuedDate: string;
  paymentMethod?: string;
  paymentMemo?: string;
}

interface DashboardData {
  status: WholesaleStatus;
  businessName?: string;
  notificationEmail?: string;
  invoices?: Invoice[];
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function WholesalePanel() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    setError("");
    fetch("/api/wholesale/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getStoredToken() }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || "Couldn't load your wholesale account.");
        setData(body);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load your wholesale account."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-sm text-charcoal/50">Loading your wholesale account…</p>;

  if (error) {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-information-line text-2xl text-charcoal/30" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Wholesale account not available yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">{error}</p>
      </div>
    );
  }

  if (!data || data.status === "NONE") {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-store-2-line text-2xl text-charcoal/30" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">No wholesale account yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">
          Submit a wholesale/dropshipping inquiry, and once approved and linked to your account, your invoices and
          settings will show up here.
        </p>
        <Link
          href="/wholesale#apply"
          className="mt-5 inline-block rounded-md bg-copper px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-copper-light"
        >
          Submit an Inquiry
        </Link>
      </div>
    );
  }

  if (data.status === "PENDING") {
    return (
      <div className="rounded-lg border border-stone bg-white p-8 text-center">
        <i className="ri-time-line text-2xl text-copper" />
        <p className="mt-3 font-display text-lg font-semibold text-charcoal">Inquiry under review</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">
          We review every wholesale inquiry by hand. You&apos;ll get an email once we&apos;re ready to move forward.
        </p>
      </div>
    );
  }

  // APPROVED
  return (
    <div className="space-y-8">
      <WholesaleSettings
        businessName={data.businessName ?? ""}
        notificationEmail={data.notificationEmail ?? ""}
        onSaved={load}
      />
      <InvoiceList invoices={data.invoices ?? []} />
    </div>
  );
}

function WholesaleSettings({
  businessName,
  notificationEmail,
  onSaved,
}: {
  businessName: string;
  notificationEmail: string;
  onSaved: () => void;
}) {
  const [business, setBusiness] = useState(businessName);
  const [email, setEmail] = useState(notificationEmail);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setSaved(false);
    if (!email.trim()) {
      setError("Enter a notification email.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/wholesale/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: getStoredToken(), notificationEmail: email.trim(), businessName: business.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Couldn't save your settings.");
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-stone bg-white p-6">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">Wholesale Settings</p>
      <p className="mb-4 text-xs text-charcoal/50">
        Where should order confirmations and invoices go? This can be a different inbox than your login email.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Business Name</label>
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Notification Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none focus:border-copper"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-red-600">
          <i className="ri-error-warning-line text-sm shrink-0" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-5 rounded-md bg-copper px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light disabled:cursor-wait disabled:opacity-60"
      >
        {saving ? "Saving..." : saved ? "Saved" : "Save Settings"}
      </button>
    </div>
  );
}

function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="rounded-lg border border-stone bg-white p-6">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">Invoices</p>

      {invoices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone bg-ivory-soft p-8 text-center">
          <i className="ri-file-list-3-line text-xl text-charcoal/30" />
          <p className="mt-2 text-sm text-charcoal/50">No invoices yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex flex-col gap-2 rounded-md border border-stone p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">{inv.label}</p>
                <p className="text-xs text-charcoal/50">
                  {new Date(inv.issuedDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  {inv.status === "UNPAID" && inv.paymentMethod && ` · Pay via ${inv.paymentMethod}${inv.paymentMemo ? ` (memo: ${inv.paymentMemo})` : ""}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-semibold text-charcoal">{money(inv.amountCents)}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                    inv.status === "PAID" ? "bg-sage-mist text-sage-deep" : "bg-copper/15 text-copper"
                  }`}
                >
                  {inv.status === "PAID" ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
