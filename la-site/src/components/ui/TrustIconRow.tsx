interface TrustItem {
  icon: string;
  label: string;
  sublabel?: string;
}

export function TrustIconRow({ items }: { items: TrustItem[]; tone?: "ring" | "plain" }) {
  return (
    <section className="overflow-hidden bg-sage-forest py-3 md:py-4">
      <div className="marquee-fade">
        <div className="flex w-max animate-[marquee_26s_linear_infinite] items-center">
          {[...items, ...items].map((item, i) => (
            <span key={`${item.label}-${i}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap px-6 text-xs text-white/70 md:text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-copper/15 text-copper">
                <i className={`${item.icon} text-xs`} />
              </span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
