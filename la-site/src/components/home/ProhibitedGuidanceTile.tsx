import Link from "next/link";

export default function ProhibitedGuidanceTile() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--color-border-subtle)",
        borderLeft: "4px solid var(--color-navy)",
        borderRadius: 8,
        padding: "1.5rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1.25rem",
        maxWidth: 760,
      }}
    >
      {/* Icon */}
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: 8,
          background: "var(--color-navy-light)",
          border: "1px solid var(--color-border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: "var(--color-navy)",
          lineHeight: 1,
        }}
      >
        ⊘
      </div>

      {/* Text */}
      <div>
        <h3
          style={{
            margin: "0 0 8px",
            fontFamily: "var(--font-display), sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--color-ink)",
          }}
        >
          Prohibited Guidance Policy
        </h3>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--color-muted)",
          }}
        >
          Liberty Aminos staff do not advise on human or animal use, dosing, protocols, or
          administration. Products are sold strictly for laboratory research.
        </p>
        <Link
          href="/prohibited-guidance"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--color-navy)",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Read the full policy →
        </Link>
      </div>
    </div>
  );
}
