"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const ACCESS_KEY = "la_research_access_v1";
const ACCESS_TTL_DAYS = 30;

function hasStoredAccess(): boolean {
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw) as { ts?: number };
    return typeof ts === "number" && Date.now() - ts < ACCESS_TTL_DAYS * 864e5;
  } catch {
    return false;
  }
}

function grantAccess() {
  try {
    localStorage.setItem(ACCESS_KEY, JSON.stringify({ ts: Date.now() }));
  } catch { /* ignore */ }
}

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(new URL(window.location.href).hostname);
    const allowed = isLocal ? true : hasStoredAccess();
    setAccepted(allowed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || accepted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [ready, accepted]);

  function handleAccept() {
    grantAccess();
    setAccepted(true);
  }

  return (
    <>
      {children}
      {ready && !accepted && (
        <div
          className="cp-age-gate"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cp-age-gate-title"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "var(--color-navy)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <Logo tone="ivory" imgClassName="h-8 w-auto" />
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "2rem 1.5rem",
              }}
            >
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: "var(--color-red)", color: "#fff",
                  fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em",
                  padding: "0.25rem 0.75rem", borderRadius: 999,
                  marginBottom: "1.25rem",
                }}
              >
                <i className="ri-shield-check-line" /> RUO · 21+
              </div>

              <h1
                id="cp-age-gate-title"
                style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "0 0 0.75rem" }}
              >
                Research Use Only
              </h1>

              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
                Liberty Aminos sells amino compounds exclusively for laboratory and analytical research.
                Products are <strong style={{ color: "#fff" }}>not for human or animal use</strong>.
                You must be 21 or older to enter.
              </p>

              <button
                onClick={handleAccept}
                style={{
                  width: "100%", padding: "0.875rem 1.5rem",
                  background: "#fff", color: "var(--color-navy)",
                  border: "none", borderRadius: 6,
                  fontWeight: 700, fontSize: "0.9375rem",
                  cursor: "pointer", marginBottom: "1rem",
                }}
              >
                I am 21+ and agree — Enter Site
              </button>

              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", lineHeight: 1.5 }}>
                By entering you confirm you are 21 or older and agree to purchase only for research purposes.
                See our{" "}
                <Link href="/ruo" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Research Use Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Terms
                </Link>.
              </p>
            </div>

            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "1.25rem" }}>
              Your choice is remembered for 30 days.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
