/**
 * Branded vial render used until real product photography is supplied.
 * Navy label with Liberty Aminos wordmark placeholder.
 */
export function ProductVisual({
  name,
  dosage,
  className = "",
  floating = false,
}: {
  name: string;
  dosage?: string | null;
  className?: string;
  floating?: boolean;
}) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${floating ? "" : "bg-surface"} ${className}`}>
      <svg
        viewBox="0 0 200 320"
        className="h-[80%] w-auto"
        style={floating ? { filter: "drop-shadow(0 26px 30px rgba(14,33,83,0.18))" } : undefined}
        aria-hidden
      >
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2d5a" />
            <stop offset="100%" stopColor="#0a1840" />
          </linearGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="100" cy="308" rx="52" ry="8" fill="#0a1840" opacity="0.15" />

        {/* cap */}
        <rect x="72" y="14" width="56" height="34" rx="6" fill="url(#cap)" />
        {/* collar */}
        <rect x="76" y="46" width="48" height="18" rx="3" fill="#c9cbc4" opacity="0.7" />

        {/* glass body */}
        <rect x="58" y="62" width="84" height="238" rx="20" fill="#e8ecf4" opacity="0.08" stroke="#e8ecf4" strokeOpacity="0.3" strokeWidth="1.5" />
        <rect x="58" y="62" width="30" height="238" rx="20" fill="url(#glass)" />

        {/* label — navy background */}
        <rect x="64" y="150" width="72" height="120" fill="#0e2153" />
        <line x1="64" y1="204" x2="136" y2="204" stroke="#c42127" strokeWidth="1" opacity="0.7" />
        <circle cx="100" cy="204" r="1.6" fill="#c42127" />

        {/* wordmark placeholder text */}
        <text x="100" y="184" textAnchor="middle" fontFamily="var(--font-body), sans-serif" fontSize="6" letterSpacing="0.8" fill="#ffffff" opacity="0.9" fontWeight="700">
          LIBERTY AMINOS
        </text>

        {/* product name */}
        <foreignObject x="68" y="212" width="64" height="34">
          <div
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 600,
              fontSize: "8.5px",
              lineHeight: 1.15,
              color: "#eef1f8",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {name}
          </div>
        </foreignObject>

        {dosage && (
          <text x="100" y="253" textAnchor="middle" fontFamily="var(--font-body), sans-serif" fontSize="8" fill="#eef1f8" opacity="0.85">
            {dosage}
          </text>
        )}

        <text x="100" y="265" textAnchor="middle" fontFamily="var(--font-body), sans-serif" fontSize="5.5" letterSpacing="0.6" fill="#eef1f8" opacity="0.6">
          RESEARCH USE ONLY
        </text>

        {/* bottom band — red accent */}
        <rect x="64" y="270" width="72" height="16" fill="#c42127" />
        <text x="100" y="280.5" textAnchor="middle" fontFamily="var(--font-body), sans-serif" fontSize="5" letterSpacing="0.4" fill="#ffffff">
          LIBERTYAMINOS.COM
        </text>
      </svg>
    </div>
  );
}
