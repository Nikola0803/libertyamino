"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getStoredUser, getStoredToken, clearAuth, setDisplayName, type AuthUser } from "@/lib/auth";
import { getOrdersForUser, mapWcOrders, type Order } from "@/lib/orders";
import { getAddressesForUser, addAddress, removeAddress, setDefaultAddress, type Address } from "@/lib/addresses";
import { useCurrency } from "@/lib/currency-context";
import { AffiliatePanel } from "./AffiliatePanel";
import { VerificationPanel } from "./VerificationPanel";
import { WholesalePanel } from "./WholesalePanel";
import { AccountDeletionPanel } from "./AccountDeletionPanel";
import { AccountAccess } from "./AccountAccess";

type Tab = "orders" | "addresses" | "profile" | "affiliate" | "verification" | "wholesale";

const STATUS_STYLE: Record<Order["status"], string> = {
  Processing: "bg-navy/15 text-navy",
  Shipped: "bg-sage-mist text-navy",
  Delivered: "bg-navy text-ivory",
  Pending: "bg-navy/15 text-navy",
  Completed: "bg-navy text-ivory",
  "On Hold": "bg-surface text-muted",
  Refunded: "bg-surface text-muted",
  Cancelled: "bg-red-100 text-red-700",
};

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "orders", label: "Orders", icon: "ri-file-list-3-line" },
  { key: "addresses", label: "Addresses", icon: "ri-map-pin-line" },
  { key: "affiliate", label: "Ambassador", icon: "ri-handshake-line" },
  { key: "verification", label: "Verification", icon: "ri-shield-check-line" },
  { key: "wholesale", label: "Wholesale", icon: "ri-store-2-line" },
  { key: "profile", label: "Profile", icon: "ri-user-settings-line" },
];

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  );
}

function AccountPageInner() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");
  const searchParams = useSearchParams();
  const justPlacedId = searchParams.get("order");
  const tabParam = searchParams.get("tab");
  const { formatPrice } = useCurrency();

  async function refresh(u: AuthUser) {
    const local = getOrdersForUser(u.user_id);
    setOrders(local);
    setAddresses(getAddressesForUser(u.user_id));

    // Real accounts (not the local-only CRM-not-configured bypass) have a
    // real token - fetch live order history from the CRM and show it
    // alongside any local-only orders placed before the CRM was connected.
    const token = getStoredToken();
    if (u.user_id === "local" || !token) return;
    try {
      const res = await fetch("/api/account/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const remote = mapWcOrders(u.user_id, data.orders ?? []);
      setOrders([...remote, ...local]);
    } catch {
      /* CRM unreachable, local orders already shown */
    }
  }

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    if (stored) refresh(stored);
    if (justPlacedId) setTab("orders");
    else if (tabParam === "affiliate") setTab("affiliate");
    else if (tabParam === "verification") setTab("verification");
    else if (tabParam === "wholesale") setTab("wholesale");
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSignOut() {
    clearAuth();
    window.location.href = "/";
  }

  if (!mounted) return null;

  if (!user) {
    return <AccountAccess initialMode={searchParams.get("mode") === "register" ? "register" : "signin"} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">My Account</p>
          <h1 className="mt-2 font-sans text-2xl font-semibold text-ink md:text-3xl">{user.username || user.email}</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md border border-charcoal px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink transition hover:bg-navy hover:text-ivory"
        >
          Sign Out
        </button>
      </div>

      {justPlacedId && (
        <div className="mt-8 flex items-center gap-2 rounded-lg border border-sage-deep/30 bg-sage-mist px-4 py-3 text-sm text-navy">
          <i className="ri-checkbox-circle-fill" />
          Order {justPlacedId} placed. You&rsquo;ll see it below.
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-4 py-3 text-xs font-semibold uppercase tracking-wide transition ${
                tab === t.key ? "bg-navy text-ivory" : "text-muted hover:text-ink"
              }`}
            >
              <i className={t.icon} /> {t.label}
              {t.key === "orders" && orders.length > 0 && (
                <span className={`ml-auto rounded-full px-1.5 text-[10px] ${tab === t.key ? "bg-surface/20" : "bg-navy/10"}`}>{orders.length}</span>
              )}
            </button>
          ))}
        </aside>

        <div>
          {tab === "orders" && <OrdersPanel orders={orders} formatPrice={formatPrice} />}
          {tab === "addresses" && (
            <AddressesPanel
              addresses={addresses}
              userId={user.user_id}
              onChange={() => refresh(user)}
            />
          )}
          {tab === "affiliate" && <AffiliatePanel />}
          {tab === "verification" && <VerificationPanel />}
          {tab === "wholesale" && <WholesalePanel />}
          {tab === "profile" && (
            <>
              <ProfilePanel user={user} onUpdate={setUser} />
              <AccountDeletionPanel />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersPanel({ orders, formatPrice }: { orders: Order[]; formatPrice: (n: number) => string }) {
  return (
    <div>
      <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-muted">Order History ({orders.length})</h2>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-subtle bg-off-white p-10 text-center">
          <i className="ri-inbox-line text-2xl text-muted" />
          <p className="mt-3 text-sm text-muted">You haven&rsquo;t placed any orders yet.</p>
          <Link href="/shop" className="mt-5 inline-block rounded-md bg-navy px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-navy-light">
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border-subtle">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-off-white px-5 py-3.5">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">Order</p>
                    <p className="font-mono text-sm font-medium text-ink">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">Placed</p>
                    <p className="text-sm text-ink">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[order.status]}`}>{order.status}</span>
              </div>

              <div className="divide-y divide-stone px-5">
                {order.lines.map((line, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{line.name}</p>
                      <p className="text-xs text-muted">
                        {line.packLabel} &middot; Qty {line.qty}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-ink">{formatPrice(line.qty * line.unitPrice)}</span>
                  </div>
                ))}
              </div>

              {order.paymentMethod && (
                <div className="flex items-center gap-2 border-t border-dashed border-border-subtle px-5 py-3 text-xs text-muted">
                  <i className="ri-bank-card-line text-navy" />
                  Pay via <span className="font-medium capitalize text-ink">{order.paymentMethod}</span>
                  {order.paymentMemo && (
                    <>
                      , memo <span className="font-mono text-navy">{order.paymentMemo}</span>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-xs text-muted">
                  Subtotal {formatPrice(order.subtotal)} + Shipping {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </span>
                <span className="font-sans text-base font-semibold text-ink">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesPanel({ addresses, userId, onChange }: { addresses: Address[]; userId: string; onChange: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", line1: "", city: "", postalCode: "", country: "United States" });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.line1 || !form.city || !form.postalCode) return;
    addAddress({ userId, ...form });
    setForm({ fullName: "", line1: "", city: "", postalCode: "", country: "United States" });
    setShowForm(false);
    onChange();
  }

  function handleRemove(id: string) {
    removeAddress(id);
    onChange();
  }

  function handleSetDefault(id: string) {
    setDefaultAddress(userId, id);
    onChange();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted">Saved Addresses ({addresses.length})</h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-md border border-charcoal px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink transition hover:bg-navy hover:text-ivory"
        >
          <i className={showForm ? "ri-close-line" : "ri-add-line"} /> {showForm ? "Cancel" : "Add Address"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 grid grid-cols-1 gap-3 rounded-lg border border-border-subtle bg-off-white p-5 sm:grid-cols-2">
          <input
            required
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className="rounded-md border border-border-subtle bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-navy"
          />
          <input
            required
            placeholder="Address"
            value={form.line1}
            onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
            className="rounded-md border border-border-subtle bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-navy"
          />
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="rounded-md border border-border-subtle bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-navy"
          />
          <input
            required
            placeholder="Postal / ZIP code"
            value={form.postalCode}
            onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
            className="rounded-md border border-border-subtle bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-navy"
          />
          <select
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            className="rounded-md border border-border-subtle bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-navy sm:col-span-2"
          >
            <option>United States</option>
            <option>Canada</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-navy py-3 text-[11px] font-semibold uppercase tracking-wide text-ink transition hover:bg-navy-light sm:col-span-2"
          >
            Save Address
          </button>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-lg border border-dashed border-border-subtle bg-off-white p-10 text-center">
          <i className="ri-map-pin-line text-2xl text-muted" />
          <p className="mt-3 text-sm text-muted">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-lg border border-border-subtle p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-ink">{a.fullName}</p>
                {a.isDefault && <span className="rounded-full bg-sage-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy">Default</span>}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {a.line1}
                <br />
                {a.city}, {a.postalCode}
                <br />
                {a.country}
              </p>
              <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide">
                {!a.isDefault && (
                  <button type="button" onClick={() => handleSetDefault(a.id)} className="text-navy transition hover:text-navy-dark">
                    Set Default
                  </button>
                )}
                <button type="button" onClick={() => handleRemove(a.id)} className="text-muted transition hover:text-ink">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePanel({ user, onUpdate }: { user: AuthUser; onUpdate: (u: AuthUser) => void }) {
  const [name, setName] = useState(user.username || "");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setDisplayName(name);
    onUpdate({ ...user, username: name });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-muted">Profile</h2>
      <form onSubmit={handleSave} className="max-w-md space-y-4 rounded-lg border border-border-subtle bg-off-white p-6">
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted">Email</label>
          <input disabled value={user.email} className="w-full cursor-not-allowed rounded-md border border-border-subtle bg-surface/30 px-4 py-2.5 text-sm text-muted" />
          <p className="mt-1.5 text-[11px] text-muted">Email changes aren&rsquo;t available yet, contact support to update it.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted">Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a display name"
            className="w-full rounded-md border border-border-subtle bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-navy"
          />
        </div>
        <button type="submit" className="rounded-md bg-navy px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink transition hover:bg-navy-light">
          {saved ? "Saved" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
