import { redirect } from "next/navigation";

/**
 * Canonical URL for the Research Use Policy is /ruo.
 * This route exists as a human-readable alias.
 */
export default function ResearchUsePolicyRedirect() {
  redirect("/ruo");
}
