"use client";

import { useEffect } from "react";
import { getStoredUser, getStoredToken, setMembershipStatus } from "@/lib/auth";

/** Mounted once in the root layout - on load, if a customer is signed in,
 * refreshes their cached Membership status from the CRM (mirrors
 * VerificationSync.tsx exactly) so ProductCard/ProductClient's
 * member-exclusive lock check stays reasonably fresh. */
export function MembershipSync() {
  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.user_id === "local") return;
    fetch("/api/membership/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getStoredToken() }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.status) setMembershipStatus(data.status);
      })
      .catch(() => {
        /* CRM unreachable, keep whatever status was last cached */
      });
  }, []);
  return null;
}
