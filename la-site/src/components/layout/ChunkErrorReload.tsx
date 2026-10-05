"use client";

import { useEffect } from "react";

const CHUNK_ERROR_PATTERN =
  /Loading chunk [\d]+ failed|ChunkLoadError|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;

/**
 * Recovers from the classic "site stops responding, needs a refresh"
 * symptom after a new deploy goes out while someone has the site open in
 * a tab. Next.js splits the app into JS chunks by route; once a new
 * deploy replaces those files on the server, a tab still running the OLD
 * build will fail to fetch the chunk for whatever it navigates to or
 * interacts with next -- the click still fires, but the code that should
 * handle it never finished loading, so nothing visibly happens. This
 * listens for that specific failure (not general JS errors) and reloads
 * the page once, which re-pulls the current build and fixes it.
 */
export function ChunkErrorReload() {
  useEffect(() => {
    let reloaded = false;
    function reloadOnce() {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    }
    function handleError(event: ErrorEvent) {
      if (CHUNK_ERROR_PATTERN.test(event.message || "")) reloadOnce();
    }
    function handleRejection(event: PromiseRejectionEvent) {
      const reason = event?.reason;
      const message = typeof reason === "string" ? reason : reason?.message || "";
      if (CHUNK_ERROR_PATTERN.test(message)) reloadOnce();
    }
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
