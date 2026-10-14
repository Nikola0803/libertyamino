"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const ACCESS_KEY = "la_age_verified";
const ACCESS_TTL_DAYS = 30;

function hasStoredAccess(): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(ACCESS_KEY) === "1") return true;
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw) as { ts?: number };
    return typeof ts === "number" && Date.now() - ts < ACCESS_TTL_DAYS * 864e5;
  } catch {
    return false;
  }
}

function rememberAccess() {
  try {
    localStorage.setItem(ACCESS_KEY, JSON.stringify({ ts: Date.now() }));
    sessionStorage.setItem(ACCESS_KEY, "1");
  } catch {
    // ignore storage failures
  }
}

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const allowed = hasStoredAccess();
    queueMicrotask(() => {
      setAccepted(allowed);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready || accepted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [ready, accepted]);

  function handleEnter() {
    rememberAccess();
    setAccepted(true);
  }

  function handleExit() {
    window.location.assign("https://www.google.com");
  }

  return (
    <>
      {children}
      {ready && !accepted && (
        <div
          className="cp-ruo-gate cp-ruo-gate-simple"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cp-age-title"
          aria-describedby="cp-age-description"
        >
          <section className="cp-ruo-entry-card cp-ruo-entry-card-campaign">
            <div className="cp-ruo-entry-brand"><Logo tone="dark" /></div>
            <h2 id="cp-age-title" className="mt-4 font-display text-2xl font-semibold text-ink">Age Verification Required</h2>
            <p id="cp-age-description" className="mt-3 text-sm leading-relaxed text-muted">
              You must be 21 years or older to view this site. This site sells products for research use only.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="cp-ruo-entry-primary flex-1"
                onClick={handleEnter}
              >
                I am 21 or older — Enter
              </button>
              <button
                type="button"
                className="flex-1 rounded-md border border-ink/30 px-5 py-3 text-sm font-semibold text-muted transition hover:bg-ink/5"
                onClick={handleExit}
              >
                I am under 21 — Exit
              </button>
            </div>
            <p className="mt-5 text-center text-[10px] leading-relaxed text-muted/60">
              For laboratory and research use only. Not for human or veterinary use. Must be 21+ to enter.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
