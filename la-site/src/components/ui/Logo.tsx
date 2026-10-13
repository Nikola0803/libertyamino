import Link from "next/link";
import Image from "next/image";

/**
 * Liberty Aminos horizontal lockup logo.
 * Real SVG/PNG asset will be supplied by Jerod. Until then a text placeholder
 * is shown. Never recreate the logo as tracked-out text.
 *
 * tone="ivory" = white logo for dark backgrounds (header, footer).
 * tone="charcoal" = dark logo for light backgrounds.
 */
export function Logo({
  tone = "ivory",
  className = "",
  imgClassName = "h-7 w-auto md:h-8",
}: {
  tone?: "ivory" | "charcoal";
  className?: string;
  imgClassName?: string;
}) {
  const src = `/logo/la-logo-${tone === "ivory" ? "light" : "dark"}.png`;
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`}>
      {/* Replace this fallback once the real logo asset is supplied */}
      <span
        className={imgClassName}
        style={{
          fontWeight: 700,
          fontSize: "1.125rem",
          letterSpacing: "0.05em",
          color: tone === "ivory" ? "#fff" : "var(--color-navy)",
          display: "inline-flex",
          alignItems: "center",
        }}
        aria-label="Liberty Aminos"
      >
        LIBERTY AMINOS
      </span>
      {/* Uncomment once logo asset is provided:
      <Image src={src} alt="Liberty Aminos" width={2400} height={600} className={imgClassName} priority />
      */}
      <span className="sr-only">Liberty Aminos</span>
    </Link>
  );
}
