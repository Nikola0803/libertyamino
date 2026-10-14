"use client";

export function QuizTrigger({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("la:open-quiz"))}
      className="font-semibold text-navy underline decoration-navy/40 underline-offset-2 hover:decoration-navy"
    >
      {children}
    </button>
  );
}
