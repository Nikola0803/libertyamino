import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";

const SHOP = [
  ["All Products", "/shop"], ["Amino Compounds", "/shop?category=peptides"],
  ["COA Library", "/coas"], ["Heroes Program", "/heroes-discount"], ["Affiliate Program", "/ambassadors"],
] as const;

const SUPPORT = [
  ["Contact", "/contact"], ["Track Order", "/track-order"],
  ["Shipping", "/shipping"], ["Returns & Claims", "/returns"],
] as const;

const COMPANY = [
  ["About", "/about"], ["FAQ", "/faq"], ["Sourcing & Quality", "/sourcing"],
] as const;

const LEGAL = [
  ["Research Use Policy", "/ruo"], ["Terms", "/terms"],
  ["Privacy", "/privacy"], ["Prohibited Guidance", "/ruo"],
] as const;

export function Footer() {
  return (
    <footer className="cp-footer">
      <div className="cp-footer-inner">
        <div className="cp-footer-main">
          <div className="cp-footer-brand">
            <Logo tone="ivory" imgClassName="cp-footer-logo" />
            <p>Research-use amino compounds with batch-level COA verification. Third-party tested, US-fulfilled.</p>
          </div>

          <FooterColumn title="Shop" links={SHOP} />
          <FooterColumn title="Support" links={SUPPORT} />
          <FooterColumn title="Company" links={COMPANY} />
          <div className="cp-footer-newsletter"><NewsletterForm /></div>
        </div>

        <div className="cp-footer-meta">
          <nav aria-label="Legal">{LEGAL.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav>
        </div>

        <details id="legal-disclaimer" className="cp-footer-disclaimer">
          <summary>Research-use disclaimer <span>+</span></summary>
          <div>
            <p>All products sold on this website are intended for laboratory and analytical research purposes only. They are not intended for human dosing, injection, ingestion, or veterinary use. Must be 21+ to purchase.</p>
            <p>The statements on this website have not been evaluated by the U.S. Food and Drug Administration. Neither the statements nor the products are intended to diagnose, treat, cure, or prevent disease.</p>
            <p>Liberty Aminos is a research chemical supplier, not a compounding pharmacy or outsourcing facility as defined under sections 503A or 503B of the Federal Food, Drug, and Cosmetic Act.</p>
          </div>
        </details>

        <div className="cp-footer-bottom"><span>© Liberty Aminos {new Date().getFullYear()}. All rights reserved.</span><span>For research use only. Not for human or animal use.</span></div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return <div className="cp-footer-column"><p>{title}</p>{links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>;
}
