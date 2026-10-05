import { FaqItem } from "./types";

// The previous export here (`testimonials`) was a set of fabricated
// social-handle quotes (@researchlab_j, etc.) never backed by a real
// review system -- removed per the B2B/analytical repositioning: an
// unverifiable quote is the same credibility problem as a fake consumer
// review. No replacement needed; nothing in the app imports it anymore
// (see ProofSection.tsx, which now renders a static institutional trust
// strip instead of any quote-based social proof).

export const faqItems: FaqItem[] = [
  {
    question: "What is your refund and/or return policy?",
    answer:
      "All sales are final. Every lot is independently verified by third-party laboratory testing prior to release, and each order is placed with the understanding that the published Certificate of Analysis has been reviewed. If you have a quality concern about a specific batch, contact us with your order number and batch code and we'll work with you directly.",
  },
  {
    question: "Where do you ship?",
    answer:
      "We ship across the US and Canada, including to university, contract-research, and analytical laboratory accounts. Orders are dispatched same day when placed before our daily cutoff.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Most orders arrive within 1–2 business days of dispatch. You'll receive tracking information as soon as your order ships. Cold-chain shipping upgrades are available for bulk orders on request.",
  },
  {
    question: "Is tracking provided?",
    answer: "Yes. Tracking is generated automatically and sent to your email within one business day of your order.",
  },
  {
    question: "How do I place a bulk or institutional order?",
    answer:
      "Standard vial quantities can be ordered directly through the catalog. For case quantities, custom synthesis, or a recurring institutional supply agreement, submit a quote request through Contact with your institution name, intended research application, and required quantities.",
  },
  {
    question: "What documentation is provided with each order?",
    answer:
      "Every lot ships with a Certificate of Analysis (CoA) confirming purity via HPLC-MS. Match the batch code on your vial to its published report on our COAs page. A Safety Data Sheet (SDS) is available on request.",
  },
  {
    question: "What is your intended use policy?",
    answer:
      "All compounds sold by EVLV are supplied strictly for laboratory, in-vitro, and analytical research use. Products are not intended, labeled, or approved for human or animal diagnostic, therapeutic, or consumptive use of any kind. By placing an order, the purchasing institution or individual affirms the product will be used solely in a controlled laboratory research setting by qualified personnel.",
  },
];
