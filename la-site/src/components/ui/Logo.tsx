import Link from "next/link";
import Image from "next/image";

/**
 * Real EVLV wordmark (geometric cut-out letterforms) - two prepared
 * variants, not a recolorable font. "ivory" = white logo, for dark
 * backgrounds (header, footer). "charcoal" = black logo, for light
 * backgrounds. Do not recreate this as styled text.
 */
export function Logo({
  tone = "ivory",
  className = "",
  imgClassName = "h-6 w-auto md:h-7",
}: {
  tone?: "ivory" | "charcoal";
  className?: string;
  imgClassName?: string;
}) {
  const src = tone === "ivory" ? "/logo/evlv-logo-light.png" : "/logo/evlv-logo-dark.png";
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`}>
      <Image src={src} alt="EVLV" width={2172} height={724} className={imgClassName} priority />
    </Link>
  );
}
