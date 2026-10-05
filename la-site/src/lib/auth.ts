"use client";

/**
 * Storefront customer session, backed by the custom CRM (peptides-crm-app)
 * via this app's own /api/auth/* proxy routes (keeps the CRM's URL and API
 * key server-side, browser never talks to the CRM directly).
 */
const TOKEN_KEY = "evlv_auth_token";
const USER_KEY = "evlv_auth_user";

export type ResearcherStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";
export type MembershipStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export interface AuthUser {
  email: string;
  username: string;
  user_id: string;
  /**
   * Cached locally, refreshed by VerificationSync.tsx (a background check
   * on app load) and by /account's Verification tab. This is a compliance
   * gate for restricted product formats (nasal sprays, injector pens) --
   * only ever synced from what the CRM actually approved, never set
   * client-side as a preview.
   */
  researcherStatus?: ResearcherStatus;
  /**
   * Cached locally, refreshed by MembershipSync.tsx and /plans. A
   * loyalty/pricing tier gate for member-exclusive blends -- manually
   * reviewed like researcherStatus (see MEMBERSHIP.md), and same rule:
   * only ever synced from what the CRM actually approved.
   */
  membershipStatus?: MembershipStatus;
}

export function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) ?? "null");
    return user
      ? { ...user, researcherStatus: user.researcherStatus ?? "NONE", membershipStatus: user.membershipStatus ?? "NONE" }
      : null;
  } catch {
    return null;
  }
}

/** Synced from the CRM (VerificationSync.tsx, or /account's Verification tab) - never set as a client-side preview. */
export function setResearcherStatus(status: ResearcherStatus) {
  const user = getStoredUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, researcherStatus: status }));
}

/** Synced from the CRM (MembershipSync.tsx, or /plans) - never set as a client-side preview; Membership requires manual approval, just like researcherStatus. */
export function setMembershipStatus(status: MembershipStatus) {
  const user = getStoredUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, membershipStatus: status }));
}

export function saveAuth(data: { token: string; email: string; username: string; user_id: string }) {
  try {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ email: data.email, username: data.username, user_id: data.user_id }));
  } catch {
    /* ignore */
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Local display-name override, since the CRM record itself isn't editable from here yet. */
export function setDisplayName(name: string) {
  const user = getStoredUser();
  if (!user) return;
  const next = { ...user, username: name };
  localStorage.setItem(USER_KEY, JSON.stringify(next));
}
