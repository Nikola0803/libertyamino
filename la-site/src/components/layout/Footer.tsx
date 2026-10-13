import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";

const SHOP_LINKS = [
  ["All Products", "/shop"],
  ["COA Library", "/coas"],
  ["Track Order", "/track-order"],
] as const;

const SUPPORT_LINKS = [
  ["Contact", "/contact"],
  ["FAQ", "/faq"],
  ["Shipping & Returns", "/policies/shipping-returns"],
] as const;

const COMPANY_LINKS = [
  ["About", "/about"],
  ["Heroes Program", "/heroes"],
  ["Affiliates", "/affiliates"],
  ["Terms", "/policies/terms"],
  ["Privacy", "/policies/privacy"],
  ["Research Use Policy", "/policies/research-use"],
] as const;

export function Footer() {
  return (
    <footer className="la-footer">
      <div className="la-footer-inner">
        <div className="la-footer-main">
          <div className="la-footer-brand">
            <Logo tone="light" />
            <p>Research-use-only amino acids and peptides. Third-party tested, US-fulfilled, COA for every batch.</p>
            <a href="mailto:info@libertyaminos.com">info@libertyaminos.com</a>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Support" links={SUPPORT_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div className="la-footer-newsletter">
            <NewsletterForm />
          </div>
        </div>

        <div className="la-footer-meta">
          <nav aria-label="Legal">
            <Link href="/policies/research-use">Research Use Only</Link>
            <Link href="/policies/terms">Terms</Link>
            <Link href="/policies/privacy">Privacy</Link>
            <Link href="/policies/prohibited-guidance">Prohibited Guidance Policy</Link>
          </nav>
        </div>

        <details id="legal-disclaimer" className="la-footer-disclaimer">
          <summary>Research-use disclaimer <span>+</span></summary>
          <div>
            <p>All products sold on this website are intended for research and identification purposes only. They are not intended for human dosing, injection, ingestion, or veterinary use.</p>
            <p>The statements on this website have not been evaluated by the U.S. Food and Drug Administration. Neither the statements nor the products are intended to diagnose, treat, cure, or prevent disease.</p>
            <p>Liberty Aminos is a chemical supplier, not a compounding pharmacy or outsourcing facility as defined under sections 503A or 503B of the Federal Food, Drug, and Cosmetic Act.</p>
          </div>
        </details>

        <div className="la-footer-bottom">
          <span>© Liberty Aminos {new Date().getFullYear()}. All rights reserved.</span>
          <span>Strictly for laboratory and analytical research.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div className="la-footer-column">
      <p>{title}</p>
      {links.map(([label, href]) => (
        <Link href={href} key={label}>{label}</Link>
      ))}
    </div>
  );
}
