import Link from "next/link";

/**
 * Liberty Aminos logo. Text placeholder until the real SVG horizontal lockup is provided.
 * Do not recreate the eventual logo as styled text — swap this component entirely.
 */
export function Logo({
  tone = "dark",
  className = "",
  imgClassName = "",
}: {
  tone?: "dark" | "light";
  className?: string;
  imgClassName?: string;
}) {
  void imgClassName;
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center font-bold tracking-tight ${tone === "light" ? "text-white" : "text-navy"} ${className}`}
      style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}
    >
      LIBERTY AMINOS
    </Link>
  );
}
