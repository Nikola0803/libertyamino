"use client";

/**
 * Storefront customer session. Authentication is proxied via /api/auth/*
 * to the WooCommerce customer API on the WP backend.
 */
const TOKEN_KEY = "la_auth_token";
const USER_KEY = "la_auth_user";

export type ResearcherStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";
export type MembershipStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export interface AuthUser {
  email: string;
  username: string;
  user_id: string;
  researcherStatus?: ResearcherStatus;
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

export function setResearcherStatus(status: ResearcherStatus) {
  const user = getStoredUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, researcherStatus: status }));
}

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

export function setDisplayName(name: string) {
  const user = getStoredUser();
  if (!user) return;
  const next = { ...user, username: name };
  localStorage.setItem(USER_KEY, JSON.stringify(next));
}
