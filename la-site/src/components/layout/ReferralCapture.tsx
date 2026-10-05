"use client";

import { useEffect } from "react";
import { captureReferralFromUrl } from "@/lib/referral";

/** Mounted once in the root layout - silently captures ?ref=CODE from any
 * landing URL into localStorage so it survives to registration/checkout. */
export function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);
  return null;
}
