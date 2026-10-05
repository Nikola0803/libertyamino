const ITEMS = [
  { icon: "ri-flask-line", title: "Third-Party", subtitle: "Tested" },
  { icon: "ri-shield-check-line", title: "Transparency", subtitle: "You Can Trust" },
  { icon: "ri-node-tree", title: "Premium", subtitle: "Quality" },
  { icon: "ri-bar-chart-line", title: "Performance", subtitle: "Driven" },
];

export function TrustBar() {
  return (
    <section className="border-b border-charcoal bg-charcoal">
      <div className="container-altr grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:gap-0">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center gap-4 px-4">
            <i className={`${item.icon} text-2xl text-copper`} aria-hidden />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white">{item.title}</p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/50">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
