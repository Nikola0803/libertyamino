import { Metadata } from "next";
import { Suspense } from "react";
import { CoasClient } from "./CoasClient";
import { getCoaEntries } from "@/lib/coa-data";

export const metadata: Metadata = {
  title: "Certificate of Analysis Library | Liberty Aminos",
  description:
    "Independent third-party batch verification reports for every Liberty Aminos research compound. Search by lot code, compound, or laboratory to verify your specific batch.",
  alternates: { canonical: "/coas" },
};

export default async function CoasPage() {
  const coaEntries = await getCoaEntries();
  return (
    <Suspense fallback={null}>
      <CoasClient coaEntries={coaEntries} />
    </Suspense>
  );
}
