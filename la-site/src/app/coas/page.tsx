import { Metadata } from "next";
import { Suspense } from "react";
import { CoasClient } from "./CoasClient";
import { getCoaEntries } from "@/lib/coa-data";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description: "Independent batch verification reports (Certificates of Analysis) for every EVLV research peptide, searchable by batch code.",
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
