"use client";

import { useEffect } from "react";
import { getStoredUser, getStoredToken, setResearcherStatus } from "@/lib/auth";

/** Mounted once in the root layout - on load, if a customer is signed in,
 * refreshes their cached researcher-verification status from the CRM so
 * ProductCard/ProductClient's synchronous lock check stays reasonably
 * fresh without every product card making its own network call. */
export function VerificationSync() {
  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.user_id === "local") return;
    fetch("/api/verification/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getStoredToken() }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.status) setResearcherStatus(data.status);
      })
      .catch(() => {
        /* CRM unreachable, keep whatever status was last cached */
      });
  }, []);
  return null;
}
