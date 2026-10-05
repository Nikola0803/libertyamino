"use client";

import { useEffect } from "react";

/**
 * Plays each homepage hero-tile's hover video on mouseenter and stops it
 * (rewound, so the poster/base image shows again) on mouseleave.
 *
 * This used to be a raw `<script>` tag baked into landing-content.json's
 * `script` field. That worked on a hard page load, but this page hits a
 * React hydration mismatch (visible in the console as minified React
 * error #418) on most loads, and React's recovery path for a hydration
 * mismatch is to throw away the entire server-rendered DOM and remount
 * the tree from scratch on the client. A `<script>` element that gets
 * (re)created that way -- via DOM APIs rather than the browser's HTML
 * parser -- never executes, so the old inline script's listeners were
 * silently gone after that remount: hence "hover works once, then it's
 * just a static image."
 *
 * A React effect isn't subject to that limitation -- it reruns on every
 * mount, remount included -- so this component is immune to whether or
 * not that hydration mismatch happens. Listeners are attached once on
 * `document` (capture phase, since mouseenter/mouseleave don't bubble)
 * rather than queried per-tile, so it also doesn't matter whether the
 * `.hero-tile` elements exist yet at mount time.
 */
export function HeroTileVideos() {
  useEffect(() => {
    const playing = new Set<HTMLVideoElement>();

    function onEnter(e: Event) {
      const target = e.target as HTMLElement | null;
      const tile = target?.closest?.(".hero-tile");
      if (!tile) return;
      const v = tile.querySelector<HTMLVideoElement>(".htv");
      if (!v) return;
      try {
        v.currentTime = 0;
      } catch {
        // ignore -- not seekable yet
      }
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      playing.add(v);
    }

    function onLeave(e: Event) {
      const target = e.target as HTMLElement | null;
      const tile = target?.closest?.(".hero-tile");
      if (!tile) return;
      const v = tile.querySelector<HTMLVideoElement>(".htv");
      if (!v) return;
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        // ignore
      }
      playing.delete(v);
    }

    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);

    return () => {
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
      playing.forEach((v) => v.pause());
      playing.clear();
    };
  }, []);

  return null;
}
