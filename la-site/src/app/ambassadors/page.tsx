import { redirect } from "next/navigation";

/**
 * This route has been renamed to /affiliates.
 * Redirecting permanently so any existing links keep working.
 */
export default function AmbassadorsRedirect() {
  redirect("/affiliates");
}
