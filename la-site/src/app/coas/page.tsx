import { Metadata } from "next";
import { Suspense } from "react";
import { CoasClient } from "./CoasClient";
import { getCoaEntries } from "@/lib/coa-data";

export const metadata: Metadata = {
  title: "COA Library | Liberty Aminos",
  description: "Every batch independently tested. Certificates of Analysis for every Liberty Aminos research compound, searchable by lot number.",
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
