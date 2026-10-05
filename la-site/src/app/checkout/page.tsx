"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_COST, ShippingProgressBar } from "@/components/layout/CartUpsellOffers";
import { getStoredUser } from "@/lib/auth";
import { PAYMENT_GATEWAYS, PAYMENT_PROCESSOR_NOTE, type PaymentGatewayId } from "@/lib/payment-config";
import { getStoredCouponCode, setStoredCouponCode } from "@/lib/referral";
import { useCouponValidation } from "@/lib/use-coupon-validation";
import { trackEvent } from "@/lib/pixel";
import { getProductImage } from "@/lib/product-images";
import { formatAttributionNote, getStoredAttribution } from "@/lib/campaign-attribution";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const CA_PROVINCES = ["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"];

const MEMO_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // avoids ambiguous 0/O/1/I/L
function generateMemo() {
  let code = "";
  for (let i = 0; i < 4; i++) code += MEMO_CHARS[Math.floor(Math.random() * MEMO_CHARS.length)];
  return code;
}

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState<"US" | "CA">("US");
  const [stateCode, setStateCode] = useState("");
  const [zip, setZip] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [ruoAttestation, setRuoAttestation] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState(() => getStoredCouponCode());

  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId | null>(null);
  const [memo, setMemo] = useState(() => generateMemo());
  const [copied, setCopied] = useState(false);
  const [handleCopied, setHandleCopied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const checkoutTracked = useRef(false);

  const cartItemsForCoupon = lines.map((l) => ({ slug: l.product.slug, quantity: l.qty }));
  // Prefer the signed-in account's email so a personal lifetime deal
  // previews immediately on page load; fall back to whatever the shopper
  // has typed into the email field so far (guest checkout).
  const storedUserEmail = getStoredUser()?.email;
  const couponCustomerEmail = storedUserEmail || email.trim() || undefined;
  const coupon = useCouponValidation(couponCode, cartItemsForCoupon, couponCustomerEmail);
  const discount = coupon.valid ? coupon.discountUsd : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shipping);
  const shippingComplete = Boolean(
    firstName.trim() && lastName.trim() && email.trim() && address1.trim() && city.trim() && stateCode && zip.trim()
  );

  useEffect(() => {
    const syncAppliedCoupon = (event: Event) => {
      const code = (event as CustomEvent<{ code?: string }>).detail?.code?.trim();
      if (code) setCouponCode(code);
    };
    window.addEventListener("evlv:coupon-applied", syncAppliedCoupon);
    return () => window.removeEventListener("evlv:coupon-applied", syncAppliedCoupon);
  }, []);

  useEffect(() => {
    if (checkoutTracked.current || lines.length === 0) return;
    checkoutTracked.current = true;
    trackEvent("begin_checkout", {
      currency,
      valueCents: Math.round(subtotal * 100),
      items: lines.map((line) => ({
        item_id: line.product.sku,
        item_name: line.product.name,
        item_category: line.product.category,
        quantity: line.qty,
        price: line.unitPrice,
      })),
    });
  }, [currency, lines, subtotal]);

  useEffect(() => {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) return;
    const timer = window.setTimeout(() => trackEvent("identify", { email: trimmed }), 800);
    return () => window.clearTimeout(timer);
  }, [email]);

  const selectedGatewayInfo = PAYMENT_GATEWAYS.find((g) => g.id === selectedGateway) ?? null;

  async function handleCopyMemo() {
    try {
      await navigator.clipboard.writeText(memo);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable, code is still visible to copy manually */
    }
  }

  async function handleCopyGatewayHandle() {
    if (!selectedGatewayInfo?.handle) return;
    try {
      await navigator.clipboard.writeText(selectedGatewayInfo.handle);
      setHandleCopied(true);
      window.setTimeout(() => setHandleCopied(false), 1800);
    } catch {
      /* clipboard unavailable, handle is still visible to copy manually */
    }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGateway || !shippingComplete || !ruoAttestation || placing) return;
    setCheckoutError("");
    setPlacing(true);
    trackEvent("order_submit_attempt", {
      currency,
      valueCents: Math.round(total * 100),
      payment_method: selectedGateway,
    });

    const user = getStoredUser();
    const gatewayInfo = PAYMENT_GATEWAYS.find((g) => g.id === selectedGateway)!;
    const attribution = getStoredAttribution();
    let orderId = "";
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.product.slug, quantity: l.qty })),
          paymentMethod: selectedGateway,
          paymentMemo: memo,
          // Cents, matching the CRM's convention everywhere else -- this
          // page computes shipping/total in whole dollars for display.
          shippingCents: Math.round(shipping * 100),
          couponCode: couponCode.trim() || undefined,
          // Same value doubles as the affiliate ?ref= candidate - the CRM's
          // order engine tries couponCode first, then affiliateRef, against
          // Affiliate.couponCode/slug (see order-engine.ts).
          affiliateRef: couponCode.trim() || undefined,
          // A real price-discount coupon (distinct from the affiliate
          // attribution code above) -- runCheckout() looks this up
          // separately and no-ops if it does not match a Coupon row, so
          // it is always safe to send even when the code above is really
          // just a referral code.
          discountCode: couponCode.trim() || undefined,
          customerNote: [
            `RUO attestation: purchaser confirmed laboratory/research use only at ${new Date().toISOString()}.`,
            formatAttributionNote(attribution),
            orderNotes.trim() || undefined,
          ]
            .filter(Boolean)
            .join(" | "),
          ruoAttested: true,
          ruoAttestedAt: new Date().toISOString(),
          customerId: user && user.user_id !== "local" ? user.user_id : undefined,
          // The deployed CRM's checkout also requires a top-level customerEmail
          // for guest checkout (billing.email alone isn't enough there).
          customerEmail: email.trim(),
          billing: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address1: address1.trim(),
            city: city.trim(),
            state: stateCode,
            zip: zip.trim(),
            country,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { number?: string; id?: string; error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || data.message || "We could not submit your order. Please try again.");
      orderId = data.number || data.id || "";
      if (!orderId) throw new Error("The order system did not return a confirmation number. Your cart has not been cleared.");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "We could not submit your order. Please try again.";
      setCheckoutError(message);
      trackEvent("order_submit_error", {
        payment_method: selectedGateway,
        error_message: message.slice(0, 180),
      });
      setPlacing(false);
      return;
    }

    trackEvent("order_created", {
      currency,
      valueCents: Math.round(total * 100),
      order_number: orderId,
      payment_method: selectedGateway,
      campaign: attribution?.campaign,
      source: attribution?.source,
    });

    clearCart();
    const params = new URLSearchParams({
      order: orderId,
      gateway: selectedGateway,
      label: gatewayInfo.label,
      handle: gatewayInfo.handle || "",
      memo,
      total: total.toFixed(2),
      currency,
    });
    router.push(`/order-success?${params.toString()}`);
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Your cart is empty</h1>
        <p className="mt-2 text-sm text-charcoal/50">Add something to your cart before checking out.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-md bg-copper px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:bg-copper-light">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cp-checkout mx-auto max-w-6xl px-4 py-10 md:py-16">
      <header className="cp-checkout-head">
        <small>Order checkout</small>
        <h1>Complete your order</h1>
        <p>Enter delivery details, choose a payment method, and review your research order before confirming.</p>
      </header>
      <div className="cp-checkout-trust" aria-label="Checkout benefits">
        <span><i className="ri-lock-2-line" /><b>Protected form</b><small>Encrypted order details</small></span>
        <span><i className="ri-truck-line" /><b>Tracked delivery</b><small>Updates after carrier scan</small></span>
        <span><i className="ri-file-shield-2-line" /><b>COA-backed batches</b><small>Documentation available</small></span>
      </div>
      <div className="cp-checkout-steps" aria-label="How checkout and payment work">
        <span><b>1</b><small>Enter delivery details</small></span>
        <span><b>2</b><small>Choose Cash App, Zelle, or Venmo</small></span>
        <span><b>3</b><small>Submit the order, then send payment</small></span>
      </div>
      <div className="cp-checkout-mobile-total" aria-label="Current order total">
        <span>{lines.reduce((sum, line) => sum + line.qty, 0)} item{lines.reduce((sum, line) => sum + line.qty, 0) === 1 ? "" : "s"} · Shipping {shipping === 0 ? "free" : formatPrice(shipping)}</span>
        <b>{formatPrice(total)}</b>
      </div>

      <form onSubmit={handlePlaceOrder} className="cp-checkout-form mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_460px]">
        <div className="space-y-6">
          <section className="cp-checkout-panel">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-charcoal/50">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="First Name" required value={firstName} onChange={setFirstName} placeholder="John" />
              <Field label="Last Name" required value={lastName} onChange={setLastName} placeholder="Doe" />
              <Field label="Email Address" required type="email" value={email} onChange={setEmail} placeholder="you@lab.edu" className="sm:col-span-2" />
              <Field label="Phone Number (optional)" type="tel" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" className="sm:col-span-2" />
              <Field label="Street Address" required value={address1} onChange={setAddress1} placeholder="123 Research Blvd, Suite 100" className="sm:col-span-2" />

              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal/70">
                  Country <span className="text-copper">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value as "US" | "CA");
                    setStateCode("");
                  }}
                  className="h-12 w-full rounded-md border border-stone bg-white px-4 text-base text-charcoal outline-none focus:border-copper"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <Field label="City" required value={city} onChange={setCity} placeholder="Boston" />

              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal/70">
                  {country === "US" ? "State" : "Province"} <span className="text-copper">*</span>
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="h-12 w-full rounded-md border border-stone bg-white px-4 text-base text-charcoal outline-none focus:border-copper"
                >
                  <option value="" disabled>
                    Select {country === "US" ? "state" : "province"}...
                  </option>
                  {(country === "US" ? US_STATES : CA_PROVINCES).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Postal / ZIP Code" required value={zip} onChange={setZip} placeholder="02110" maxLength={10} />
            </div>

            <label className="mt-6 flex items-start gap-3 rounded-lg border border-stone bg-ivory-soft p-4">
              <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-copper" />
              <span className="text-xs leading-relaxed text-charcoal/60">
                By checking this box, you agree to receive text messages from EVLV at the number provided. Consent
                is not a condition to purchase. Message frequency varies. Message and data rates may apply. Reply
                STOP to cancel or HELP for help. View our{" "}
                <Link href="/privacy" className="text-copper hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-copper hover:underline">
                  Terms of Service
                </Link>
                .
              </span>
            </label>
          </section>

          <section className="cp-checkout-panel">
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-charcoal/50">
              Promo / Referral Code <span className="font-normal normal-case text-charcoal/40">(optional)</span>
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                const next = e.target.value.toUpperCase();
                setCouponCode(next);
                setStoredCouponCode(next);
              }}
              placeholder="Enter a code"
              className="h-12 w-full rounded-md border border-stone bg-white px-4 text-base uppercase tracking-wide text-charcoal outline-none placeholder:text-charcoal/40 placeholder:normal-case focus:border-copper"
            />
            {coupon.checking && <p className="mt-1.5 text-xs text-charcoal/40">Checking code...</p>}
            {!coupon.checking && coupon.valid && (
              <p className="mt-1.5 text-xs font-medium text-sage-deep">
                {couponCode.trim() ? "Code applied" : "Member reward applied"} -- {formatPrice(coupon.discountUsd)} off
                {coupon.flooredByMargin ? " (partial, discount limit reached)" : ""}
              </p>
            )}
          </section>

          <section className="cp-checkout-panel">
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-charcoal/50">
              Order Notes <span className="font-normal normal-case text-charcoal/40">(optional)</span>
            </label>
            <textarea
              maxLength={500}
              rows={4}
              placeholder="Any special instructions or notes..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full resize-none rounded-md border border-stone bg-white px-4 py-3.5 text-base text-charcoal outline-none placeholder:text-charcoal/40 focus:border-copper"
            />
            <p className="mt-1.5 text-right text-xs text-charcoal/40">{orderNotes.length}/500</p>
          </section>
        </div>

        <div className="cp-checkout-sidebar h-fit space-y-6">
          <div className="cp-checkout-summary rounded-lg border border-stone bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal/50">Order Summary</h2>
            <ShippingProgressBar />
            <div className="space-y-5">
              {lines.map((line) => (
                <div key={`${line.product.id}-${line.packLabel}`} className="flex gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-white">
                    <Image src={getProductImage(line.product)} alt={line.product.name} width={120} height={150} className="h-full w-full object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] font-semibold text-ivory">{line.qty}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-charcoal">{line.product.name}</p>
                    <p className="text-sm text-charcoal/50">{line.packLabel}</p>
                  </div>
                  <span className="text-base font-semibold text-charcoal">{formatPrice(line.qty * line.unitPrice)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-stone pt-5 text-base">
              <div className="flex items-center justify-between">
                <span className="text-charcoal/60">Subtotal</span>
                <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sage-deep">
                    Discount{couponCode.trim() ? ` (${couponCode.trim()})` : " (member reward)"}
                  </span>
                  <span className="font-medium text-sage-deep">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span className="font-medium text-charcoal">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-stone pt-3 text-lg">
                <span className="font-medium text-charcoal">Total</span>
                <span className="font-display text-xl font-semibold text-charcoal">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="cp-checkout-payment">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal/50">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_GATEWAYS.map((gw) => {
                const active = selectedGateway === gw.id;
                return (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => {
                      setSelectedGateway(gw.id);
                      setHandleCopied(false);
                      trackEvent("select_payment_method", {
                        currency,
                        valueCents: Math.round(total * 100),
                        payment_method: gw.id,
                      });
                    }}
                    aria-pressed={active}
                    className={`relative flex flex-col items-center gap-2.5 rounded-lg border p-5 transition ${
                      active ? "border-copper bg-copper/10" : "border-stone bg-ivory-soft hover:border-charcoal/30"
                    }`}
                  >
                    {active && <i className="ri-checkbox-circle-fill absolute right-2.5 top-2.5 text-base text-copper" />}
                    <i className={`${gw.icon} text-3xl ${active ? "text-copper" : "text-charcoal/40"}`} />
                    <span className={`text-sm font-medium ${active ? "text-copper" : "text-charcoal/60"}`}>{gw.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedGatewayInfo && (
              <div className="mt-4 rounded-lg border border-stone bg-ivory-soft p-5">
                <p className="mb-3 text-xs leading-relaxed text-charcoal/55">{PAYMENT_PROCESSOR_NOTE}</p>
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-charcoal/70">
                  <i className={`${selectedGatewayInfo.icon} text-copper`} /> Send your {selectedGatewayInfo.label} payment to
                </p>
                {selectedGatewayInfo.handle ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="flex h-12 flex-1 items-center truncate rounded-md border border-copper/40 bg-white px-4 font-mono text-base text-copper">
                        {selectedGatewayInfo.handle}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyGatewayHandle}
                        className="h-12 shrink-0 whitespace-nowrap rounded-md border border-stone px-4 text-sm font-medium text-charcoal/70 transition hover:border-copper hover:text-copper"
                      >
                        {handleCopied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-charcoal/50">{selectedGatewayInfo.handleNote}</p>
                  </>
                ) : (
                  <p className="flex items-start gap-2 text-sm leading-relaxed text-charcoal/60">
                    <i className="ri-mail-send-line mt-0.5 shrink-0 text-copper" />
                    We&rsquo;ll email your {selectedGatewayInfo.label} payment details right after you place this
                    order, along with your memo code below.
                  </p>
                )}
              </div>
            )}

            {selectedGatewayInfo && <div className="mt-4 rounded-lg border border-copper/30 bg-copper/5 p-5">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold text-charcoal">Payment Memo</label>
                <span className="text-xs text-charcoal/45">Generated for this order</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-14 flex-1 items-center justify-center rounded-md border border-copper/40 bg-white font-mono text-2xl tracking-[0.4em] text-copper"
                >
                  {memo}
                </span>
                <button
                  type="button"
                  onClick={handleCopyMemo}
                  className="h-14 shrink-0 whitespace-nowrap rounded-md border border-stone px-5 text-sm font-medium text-charcoal/70 transition hover:border-copper hover:text-copper"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-charcoal/50">
                Include this exact code in your {selectedGatewayInfo.label} payment note so we can match your payment to this order. Inventory is confirmed after the order is submitted.
              </p>
            </div>}
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-stone bg-ivory-soft p-4">
            <input
              type="checkbox"
              checked={ruoAttestation}
              onChange={(e) => setRuoAttestation(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-copper"
            />
            <span className="text-xs leading-relaxed text-charcoal/60">
              I confirm I am purchasing these products exclusively for laboratory, analytical, or in-vitro research
              use by qualified personnel, not for human or animal consumption, administration, or any diagnostic
              or therapeutic purpose, in accordance with the{" "}
              <Link href="/ruo" className="text-copper hover:underline">
                Research Use Only Policy
              </Link>
              . I understand this order and its attestation are retained as part of the order record.
            </span>
          </label>

          {checkoutError && (
            <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm leading-relaxed text-red-800">
              <p className="font-semibold"><i className="ri-error-warning-line mr-1.5" />Order not submitted</p>
              <p className="mt-1">{checkoutError} Your cart is still saved.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedGateway || !shippingComplete || !ruoAttestation || placing}
            className="w-full rounded-md bg-copper px-5 py-5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal transition hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {placing ? "Submitting Order..." : `Submit Order & Continue to Payment · ${formatPrice(total)}`}
          </button>
          <p className="-mt-3 text-center text-[11px] leading-relaxed text-charcoal/45">
            No payment is collected by this button. Your selected payment instructions appear immediately after submission.
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  maxLength,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-charcoal/70">
        {label} {required && <span className="text-copper">*</span>}
      </label>
      <input
        type={type}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-md border border-stone bg-white px-4 text-base text-charcoal outline-none placeholder:text-charcoal/40 focus:border-copper"
      />
    </div>
  );
}
