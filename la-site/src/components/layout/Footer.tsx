import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";
import { PAYMENT_GATEWAYS } from "@/lib/payment-config";

const SHOP = [
  ["All Products", "/shop"], ["Peptides", "/shop?category=peptides"],
  ["Research Peptides USA", "/research-peptides-usa"], ["COA Library", "/coas"], ["Wholesale", "/wholesale"],
] as const;

const SUPPORT = [
  ["Contact", "/contact"], ["Track Order", "/track-order"],
  ["Shipping", "/shipping"], ["Returns", "/returns"],
] as const;

const COMPANY = [
  ["About EVLV", "/about"], ["Research Journal", "/journal"],
  ["Partner Network", "/ambassadors"], ["FAQ", "/faq"], ["Sourcing & Quality", "/sourcing"],
] as const;

export function Footer() {
  return (
    <footer className="cp-footer">
      <div className="cp-footer-inner">
        <div className="cp-footer-main">
          <div className="cp-footer-brand">
            <Logo tone="ivory" imgClassName="cp-footer-logo" />
            <p>Premium research-use-only peptides backed by transparent batch documentation.</p>
            <a href="mailto:office@evlvpeptides.com">office@evlvpeptides.com</a>
            <a className="cp-footer-vpr" href="https://verifiedpeptidereviews.com/vendors/evlv-peptides" target="_blank" rel="noreferrer">
              <img className="cp-vpr-logo" src="/images/brand/vpr-logo-clean.png" alt="Verified Peptide Reviews" /><span><span className="cp-vpr-stars" aria-label="5 out of 5 stars">★★★★★</span> 4.9 / 5 · 712 verified reviews</span><i>Verify us ↗</i>
            </a>
          </div>

          <FooterColumn title="Shop" links={SHOP} />
          <FooterColumn title="Support" links={SUPPORT} />
          <FooterColumn title="Company" links={COMPANY} />
          <div className="cp-footer-newsletter"><NewsletterForm /></div>
        </div>

        <div className="cp-footer-meta">
          <div className="cp-footer-payments"><small>Secure payment options</small>{PAYMENT_GATEWAYS.map(gateway => <span key={gateway.id}><i className={gateway.icon} />{gateway.label}</span>)}</div>
          <nav aria-label="Legal"><Link href="/ruo">Research Use Only</Link><Link href="/indemnity-waiver">Indemnity</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link></nav>
        </div>

        <details id="legal-disclaimer" className="cp-footer-disclaimer">
          <summary>Research-use disclaimer <span>+</span></summary>
          <div>
            <p>All products sold on this website are intended for research and identification purposes only. They are not intended for human dosing, injection, ingestion, or veterinary use.</p>
            <p>The statements on this website have not been evaluated by the U.S. Food and Drug Administration. Neither the statements nor the products are intended to diagnose, treat, cure, or prevent disease.</p>
            <p>EVLV is a chemical supplier, not a compounding pharmacy or outsourcing facility as defined under sections 503A or 503B of the Federal Food, Drug, and Cosmetic Act.</p>
          </div>
        </details>

        <div className="cp-footer-bottom"><span>© EVLV {new Date().getFullYear()}. All rights reserved.</span><span>Strictly for laboratory and analytical research.</span></div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return <div className="cp-footer-column"><p>{title}</p>{links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>;
}
