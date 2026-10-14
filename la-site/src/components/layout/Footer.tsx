import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const SHOP = [
  ["All Compounds", "/shop"],
  ["GLP1-S", "/shop/glp1-s"],
  ["GLP2-T", "/shop/glp2-t"],
  ["GLP3-R", "/shop/glp3-r"],
  ["Bac Water", "/shop/bac-water"],
] as const;

const RESEARCH = [
  ["COA Library", "/coas"],
  ["SDS Library", "/sds"],
  ["Track Order", "/track-order"],
] as const;

const COMPANY = [
  ["About", "/about"],
  ["Heroes Program", "/heroes"],
  ["Affiliates", "/affiliates"],
  ["Contact", "/contact"],
] as const;

export function Footer() {
  return (
    <footer className="cp-footer">
      <div className="cp-footer-inner">
        <div className="cp-footer-main">
          <div className="cp-footer-brand">
            <Logo tone="light" className="cp-footer-logo" />
            <p>
              Third-party tested research amino compounds. COA for every production lot.
              US-fulfilled. For research use only.
            </p>
            <a href="mailto:info@libertyaminos.com">info@libertyaminos.com</a>
          </div>

          <FooterColumn title="Shop" links={SHOP} />
          <FooterColumn title="Research" links={RESEARCH} />
          <FooterColumn title="Company" links={COMPANY} />
        </div>

        <div className="cp-footer-meta">
          <div className="cp-footer-payments">
            <small>Payment options</small>
            <span>P2P</span>
            <span>BTC</span>
            <span>USDC</span>
            <span>USDT</span>
          </div>
          <nav aria-label="Legal">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/ruo">Research Use Policy</Link>
            <Link href="/prohibited-guidance">Prohibited Guidance Policy</Link>
          </nav>
        </div>

        <details id="legal-disclaimer" className="cp-footer-disclaimer">
          <summary>Research-use disclaimer <span>+</span></summary>
          <div>
            <p>
              All products sold strictly for in-vitro research. Not for human consumption,
              veterinary use, or diagnostic purposes. Must be 21+ to purchase. Liberty Aminos
              provides no medical, clinical, or dosing guidance.
            </p>
          </div>
        </details>

        <div className="cp-footer-bottom">
          <span>© 2026 Liberty Aminos</span>
          <span>
            <Link href="/terms">Terms</Link>
            {" · "}
            <Link href="/privacy">Privacy</Link>
            {" · "}
            <Link href="/ruo">Research Use Policy</Link>
            {" · "}
            <Link href="/prohibited-guidance">Prohibited Guidance Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div className="cp-footer-column">
      <p>{title}</p>
      {links.map(([label, href]) => (
        <Link href={href} key={label}>{label}</Link>
      ))}
    </div>
  );
}
