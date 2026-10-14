import Link from "next/link";

export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const color = tone === "light" ? "text-white" : "text-navy";
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`}>
      <span className={`text-sm font-bold tracking-[0.12em] uppercase ${color}`}>
        Liberty Aminos
      </span>
    </Link>
  );
}
