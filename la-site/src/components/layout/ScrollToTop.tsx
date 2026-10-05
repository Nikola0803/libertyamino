"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Next.js App Router's built-in scroll-to-top-on-navigation doesn't
 * reliably fire on this site -- several pages (this homepage included)
 * do async data fetching in the server component before the new page
 * paints, and by the time content actually lands the router's own
 * scroll restoration has already run against the still-short/loading
 * page, so the browser keeps whatever scroll offset the PREVIOUS page
 * was at. That's why clicking through to a new page can land you down
 * near the footer instead of at the top.
 *
 * This just forces window scroll to (0, 0) every time the pathname
 * actually changes, after the new page has painted. Deliberately keyed
 * on pathname only (not search params) -- filtering/sorting on a page
 * like /shop shouldn't yank the user back to the top.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
