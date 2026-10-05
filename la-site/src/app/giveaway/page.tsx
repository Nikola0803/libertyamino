import { Metadata } from "next";
import { getGiveawayStatus } from "@/lib/deal-and-giveaway";
import { GiveawayEntryForm } from "./GiveawayEntryForm";

export const metadata: Metadata = {
  title: "Giveaway | EVLV",
  description: "Enter EVLV's giveaway for a chance to win -- free entry, no purchase necessary.",
};

const DEFAULT_RULES =
  "No purchase necessary to enter or win. One free entry per person per day via the link on this page. Placing a qualifying order today also earns one automatic entry -- purchasing does not increase your odds of winning beyond that one entry, and is not required to enter or win. Winner is selected at random from that day's entries. Void where prohibited.";

/** Strips a leading "a "/"an " for standalone display (e.g. in the prize
 * box) -- prizeLabel is written to read naturally mid-sentence ("win a $25
 * EVLV Store Credit"), which looks odd as a floating label on its own. */
function prizeHeadline(label: string): string {
  return label.replace(/^(a|an)\s+/i, "");
}

export default async function GiveawayPage() {
  const giveaway = await getGiveawayStatus();
  const isLive = Boolean(giveaway && giveaway.enabled);
  const minOrder = typeof giveaway?.minOrderCents === "number" ? (giveaway.minOrderCents / 100).toFixed(0) : null;

  return (
    <>
      <section className="-mt-[90px] bg-charcoal pb-16 pt-[150px] text-white md:-mt-[100px] md:pb-20 md:pt-[170px]">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8">
          {isLive ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Today's Giveaway</p>
                <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                  {minOrder
                    ? `Orders Over $${minOrder} Are Automatically Entered`
                    : giveaway?.prizeLabel
                      ? `Win ${giveaway.prizeLabel}`
                      : "Enter to Win"}
                </h1>
                {giveaway?.prizeLabel && (
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                    Place a qualifying order today and you&rsquo;re automatically entered for {giveaway.prizeLabel}. No
                    forms, no codes, no extra steps.
                  </p>
                )}
                <a
                  href="/shop"
                  className="mt-7 inline-block rounded-md bg-copper px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-copper-light"
                >
                  Shop Now
                </a>
              </div>

              {giveaway?.prizeLabel && (
                <div className="rounded-lg border border-white/15 bg-white/5 px-7 py-6 text-center md:min-w-[220px]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Today's Prize</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-copper">{prizeHeadline(giveaway.prizeLabel)}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Giveaway</p>
              <h1 className="font-display text-4xl font-semibold md:text-5xl">No Giveaway Running Right Now</h1>
              <p className="mx-auto mt-4 max-w-md text-sm text-white/70">
                Check back soon -- we run these periodically and announce them on the homepage.
              </p>
            </div>
          )}

          {isLive && typeof giveaway?.entryCount === "number" && (
            <p className="mt-8 border-t border-white/10 pt-5 text-sm text-white/60">
              {giveaway.entryCount} entered today
            </p>
          )}
        </div>
      </section>

      {isLive && (
        <>
          <section className="bg-ivory py-14 md:py-20">
            <div className="mx-auto max-w-[1000px] px-4 md:px-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <HowItWorksStep n={1} title="Order" body="Place a qualifying order over today's minimum." />
                <HowItWorksStep n={2} title="Auto Entry" body="Your eligible order is automatically entered -- no forms, no codes." />
                <HowItWorksStep n={3} title="Winner" body="A winner is selected at random once entries close for the day." />
              </div>
            </div>
          </section>

          <section className="bg-ivory pb-16 md:pb-28">
            <div className="mx-auto max-w-[560px] px-4 md:px-8">
              <div className="rounded-lg border border-stone bg-ivory-soft p-6">
                <h3 className="mb-2 font-display text-base font-semibold text-charcoal">Official Rules</h3>
                <p className="whitespace-pre-line text-xs leading-relaxed text-charcoal/60">
                  {giveaway?.rulesText?.trim() || DEFAULT_RULES}
                </p>
              </div>
              <GiveawayEntryForm />
            </div>
          </section>
        </>
      )}
    </>
  );
}

function HowItWorksStep({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-stone bg-white p-5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-copper">{n}. {title}</p>
      <p className="text-sm leading-relaxed text-charcoal/60">{body}</p>
    </div>
  );
}
