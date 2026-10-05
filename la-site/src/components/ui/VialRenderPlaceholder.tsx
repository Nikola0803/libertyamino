export function VialRenderPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-charcoal ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 38%, rgba(151,164,148,0.22) 0%, rgba(20,23,15,0) 70%)",
        }}
      />
      <svg viewBox="0 0 200 260" className="relative h-[58%] w-auto" aria-hidden>
        <defs>
          <linearGradient id="vialRimLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#97A494" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#97A494" stopOpacity="0" />
            <stop offset="100%" stopColor="#97A494" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect x="70" y="20" width="60" height="24" rx="5" fill="#0b0d09" stroke="url(#vialRimLight)" strokeWidth="1" />
        <rect x="60" y="46" width="80" height="180" rx="18" fill="#0b0d09" stroke="url(#vialRimLight)" strokeWidth="1.5" />
        <rect x="66" y="120" width="68" height="98" rx="12" fill="#161a11" opacity="0.9" />
        <line x1="60" y1="120" x2="140" y2="120" stroke="url(#vialRimLight)" strokeWidth="1" />
      </svg>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.18em] text-white/35">
        3D macro render - 3200 × 4000
      </div>
    </div>
  );
}
