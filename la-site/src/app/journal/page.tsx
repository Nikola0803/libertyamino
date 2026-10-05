import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getJournalArticles } from "@/lib/journal-data";

export const metadata: Metadata = {
  title: "Journal | EVLV",
  description: "Long-form notes on peptide purity, batch testing methodology and the EVLV research standard.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const articles = getJournalArticles();

  return (
    <>
      <section className="cp-info-hero cp-info-quality -mt-[90px] bg-charcoal pb-20 pt-[150px] text-center text-white md:-mt-[100px] md:pb-32 md:pt-[170px]">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Journal</p>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Research deserves better standards.</h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70">
            Long-form notes on testing methodology, sourcing and the research behind the EVLV standard.
          </p>
        </div>
      </section>

      <section className="bg-ivory py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {articles.map((article, i) => (
              <Link key={article.slug} href={`/journal/${article.slug}`} className="group block">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-sage-mist">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-6 flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-wider text-copper">
                  <span>{String(i + 1).padStart(2, "0")} /</span> {article.label}
                </p>
                <h2 className="mt-2 font-display text-xl font-medium text-charcoal">{article.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-soft-gray">{article.excerpt}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-charcoal/40">{article.readTime}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-sage-deep">
                  Read Article <i className="ri-arrow-right-line transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
