import Link from "next/link";

export function Hero() {
  return (
    <section className="cp-hero cp-wrap">
      {/* Left: navy copy panel */}
      <div className="cp-hero-copy">
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#a1b5e2",
            marginBottom: 18,
          }}
        >
          Third-Party Tested · COA Every Batch
        </p>

        <h1>
          Research amino<br />
          <span>compounds.</span>
          <br />
          <span
            style={{
              display: "block",
              fontSize: "0.52em",
              fontWeight: 400,
              color: "#d3e0db",
              letterSpacing: "-.01em",
              lineHeight: 1.4,
              marginTop: 8,
            }}
          >
            Verified to the lot.
          </span>
        </h1>

        <p>
          Every compound ships with an independent certificate of analysis.
          No exceptions, no exclusions.
        </p>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 30,
          }}
        >
          {["COA Verified — All Active Lots", "US Fulfilment", "99%+ Purity HPLC"].map((badge) => (
            <span
              key={badge}
              style={{
                padding: "5px 12px",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                color: "#d3e0db",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="cp-primary" href="/shop">
            Shop All Compounds
          </Link>
          <Link
            href="/coas"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 48,
              padding: "0 28px",
              borderRadius: 25,
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              transition: "border-color .2s, background .2s",
            }}
          >
            View COA Library
          </Link>
        </div>
      </div>

      {/* Right: vial image placeholder */}
      <VialRenderPlaceholder />
    </section>
  );
}

function VialRenderPlaceholder() {
  return (
    <div
      className="cp-hero-image"
      style={{
        background: "linear-gradient(135deg, #0a1840 0%, #0e2153 55%, #1a3470 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 40,
      }}
      aria-label="Liberty Aminos product image — awaiting asset"
    >
      {/* Vial silhouette placeholder */}
      <div
        style={{
          position: "relative",
          width: 110,
          height: 190,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 100%)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: "8px 8px 12px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.35)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        <span>Hero<br />Image<br />Pending</span>
      </div>

      {/* COA float badge */}
      <div
        style={{
          padding: "10px 16px",
          background: "#fff",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#0e2153",
            color: "#fff",
            fontSize: 14,
          }}
        >
          ✓
        </span>
        <div>
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "#5a6272",
            }}
          >
            COA Verified
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0e2153" }}>
            Lot Active
          </div>
        </div>
      </div>
    </div>
  );
}
