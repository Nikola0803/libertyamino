import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { getCatalogProducts } from "@/lib/catalog";
import { Footer } from "@/components/layout/Footer";
import { CartToast } from "@/components/layout/CartToast";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ReferralCapture } from "@/components/layout/ReferralCapture";
import { AgeGate } from "@/components/layout/AgeGate";
import { CartProvider } from "@/lib/cart-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ChunkErrorReload } from "@/components/layout/ChunkErrorReload";
import { ConversionPrompts } from "@/components/layout/ConversionPrompts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://libertyaminos.com";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Liberty Aminos: Third-Party Tested Research Amino Compounds",
    template: "%s | Liberty Aminos",
  },
  description:
    "Research-use amino compounds with batch-level COA verification. Third-party tested, US-fulfilled. For research use only — not for human or animal use.",
  keywords: [
    "research amino compounds",
    "research use only",
    "COA verified",
    "third-party tested",
    "liberty aminos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Liberty Aminos",
    title: "Liberty Aminos: Third-Party Tested Research Amino Compounds",
    description:
      "Research-use amino compounds with batch-level COA verification. Third-party tested, US-fulfilled. Not for human or animal use.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Liberty Aminos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liberty Aminos: Third-Party Tested Research Amino Compounds",
    description:
      "Research-use amino compounds with batch-level COA verification. Third-party tested, US-fulfilled. Not for human or animal use.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Liberty Aminos",
  url: SITE_URL,
  description:
    "Research-use amino compounds with batch-level COA verification. Third-party tested, US-fulfilled. Not for human or animal use.",
  areaServed: ["US"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    areaServed: ["US"],
    availableLanguage: "English",
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Liberty Aminos",
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = await getCatalogProducts();
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD).replace(/</g, "\\u003c") }} />
      </head>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <ScrollToTop />
        <ChunkErrorReload />
        <ReferralCapture />
        <CurrencyProvider>
          <CartProvider>
            <AgeGate>
              <AnnouncementBar />
              <Header products={products} />
              <main className="flex-1 bg-white pt-[90px] md:pt-[100px]">{children}</main>
              <Footer />
              <CartToast />
              <CartDrawer products={products} />
              <ConversionPrompts />
            </AgeGate>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
