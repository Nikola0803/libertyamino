const ITEMS = [
  { icon: "ri-flask-line", title: "Third-Party Tested", sub: "Independent labs, every batch" },
  { icon: "ri-file-list-3-line", title: "COA Every Batch", sub: "Batch-level documentation" },
  { icon: "ri-map-pin-line", title: "US Fulfilled", sub: "Shipped from the United States" },
  { icon: "ri-shield-check-line", title: "RUO · 21+", sub: "Research use only purchasers" },
];

export function TrustBar() {
  return (
    <section className="la-trust-bar" aria-label="Liberty Aminos trust standards">
      <div className="la-trust-bar-inner">
        {ITEMS.map((item) => (
          <div key={item.title} className="la-trust-item">
            <i className={item.icon} aria-hidden />
            <div>
              <p>{item.title}</p>
              <small>{item.sub}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
