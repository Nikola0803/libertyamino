import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="cp-announcement">
      <span>
        <b>RESEARCH USE ONLY</b> · Not for human or animal use · 21+
      </span>
      <span className="flex items-center gap-3">
        Free shipping over $150
        <Link
          href="/heroes"
          className="bg-red text-white rounded-full px-3 py-0.5 text-[10px] font-bold whitespace-nowrap"
        >
          🎖 Military &amp; First Responders — 15% Off, For Life
        </Link>
      </span>
    </div>
  );
}
