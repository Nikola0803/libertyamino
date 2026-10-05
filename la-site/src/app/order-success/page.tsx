import Link from "next/link";
import QRCode from "qrcode";
import { buildQuickPayTarget, getEffectiveHandle, PAYMENT_PROCESSOR_NOTE, type PaymentGatewayId } from "@/lib/payment-config";
import { PurchasePixel } from "./PurchasePixel";
import { PaymentActionLink } from "./PaymentActionLink";

const GATEWAY_IDS: PaymentGatewayId[] = ["cashapp", "zelle", "venmo"];

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orderNumber = typeof params.order === "string" ? params.order : "";
  const gatewayLabel = typeof params.label === "string" ? params.label : "your selected method";
  const handle = typeof params.handle === "string" ? params.handle : "";
  const memo = typeof params.memo === "string" ? params.memo : "";
  const gatewayParam = typeof params.gateway === "string" ? params.gateway : "";
  // checkout/page.tsx sends this as `total` (added alongside `currency` for
  // the purchase pixel) -- kept as `amount` internally here since that's
  // what the quick-pay/QR logic below is named after.
  const amountParam = typeof params.total === "string" ? params.total : "";
  const amount = Number(amountParam);

  const gateway: PaymentGatewayId | null = GATEWAY_IDS.includes(gatewayParam as PaymentGatewayId)
    ? (gatewayParam as PaymentGatewayId)
    : null;

  // Only build a quick-pay QR/link when we have a real gateway + amount + memo
  // to encode. isDemo tells us whether we're using a real handle or the
  // placeholder one, so the UI can be honest about which it is.
  let qrDataUrl: string | null = null;
  let quickPay: ReturnType<typeof buildQuickPayTarget> | null = null;
  let isDemoHandle = false;

  if (gateway && memo && amount > 0) {
    quickPay = buildQuickPayTarget(gateway, amount, memo);
    isDemoHandle = getEffectiveHandle(gateway).isDemo;
    const qrContent = quickPay.kind === "payLink" ? quickPay.url : quickPay.text;
    qrDataUrl = await QRCode.toDataURL(qrContent, { margin: 1, width: 240, color: { dark: "#2a2622", light: "#f7f4ef" } });
  }

  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center px-4 py-20 text-center md:px-8">
      {orderNumber && Number.isFinite(amount) && amount > 0 && (
        <PurchasePixel orderNumber={orderNumber} total={amount} currency="USD" />
      )}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-sage-deep/30 bg-sage-mist">
        <i className="ri-check-line text-3xl text-sage-deep" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-charcoal md:text-3xl">Order Submitted — Complete Payment</h1>

      {orderNumber && <p className="mt-4 font-mono text-sm tracking-wider text-copper">Order #{orderNumber}</p>}

      <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/60">
        Your order has been received. Please complete payment via <strong className="text-charcoal">{gatewayLabel}</strong>
        {handle ? (
          <>
            {" "}
            to <span className="font-mono text-copper">{handle}</span>
          </>
        ) : (
          " using the details we email you"
        )}
        .
      </p>
      <p className="mt-2 max-w-md text-xs leading-relaxed text-charcoal/45">{PAYMENT_PROCESSOR_NOTE}</p>

      {memo && (
        <div className="mt-6 w-full max-w-md rounded-md border-2 border-copper bg-copper/5 p-5 text-left">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-copper">
            <i className="ri-error-warning-line text-sm" />
            Required - Payment Note
          </p>
          <p className="mt-2 text-sm leading-relaxed text-charcoal">
            Enter <span className="font-mono text-base font-bold text-copper">{memo}</span> as the entire payment note. Nothing
            else.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
            This code is how our system automatically matches your payment to Order #{orderNumber || "this order"}. Adding your
            name, a message, or any other text alongside it can prevent the match and delay processing by a day or more.
          </p>
        </div>
      )}

      {qrDataUrl && quickPay && gateway && (
        <div className="mt-6 w-full max-w-md rounded-md border border-stone bg-ivory p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/50">Quick Pay</p>

          {isDemoHandle && (
            <p className="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-charcoal/40">
              Demo handle shown - this store&apos;s real {gatewayLabel} handle isn&apos;t set up yet, so this won&apos;t reach us.
              The scan/tap mechanism itself is fully functional and will work the moment a real handle is configured.
            </p>
          )}

          <img src={qrDataUrl} alt={`${gatewayLabel} quick pay QR code`} width={200} height={200} className="mx-auto mt-4 rounded-md border border-stone" />

          {quickPay.kind === "payLink" ? (
            <>
              <p className="mt-3 text-xs text-charcoal/50">Scan on desktop, or tap the button below on your phone.</p>
              <PaymentActionLink href={quickPay.url} gateway={gateway} orderNumber={orderNumber} amount={amount}>
                Open {gatewayLabel} - Pay ${amount.toFixed(2)}
              </PaymentActionLink>
              <p className="mt-2 text-[11px] text-charcoal/40">The amount and note are pre-filled for you.</p>
            </>
          ) : (
            <p className="mt-3 text-xs leading-relaxed text-charcoal/50">
              Zelle doesn&apos;t support one-tap payment links - bank apps don&apos;t allow it. Scan this QR in your banking app&apos;s
              camera to see the handle, amount, and note, then send the payment from there.
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-charcoal/40">Orders are typically dispatched within 24 hours of payment confirmation.</p>

      <p className="mt-6 max-w-md text-[11px] leading-relaxed text-charcoal/40">
        This order is supplied strictly for laboratory and analytical research use, in accordance with our{" "}
        <Link href="/ruo" className="text-copper hover:underline">
          Research Use Only Policy
        </Link>
        . Not for human or veterinary use.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/account" className="rounded-md bg-copper px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:bg-copper-light">
          View Order
        </Link>
        <Link href="/shop" className="rounded-md border border-charcoal px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:bg-charcoal hover:text-ivory">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
