import Image from "next/image";
import Link from "next/link";
import { getJournalArticles } from "@/lib/journal-data";
import { Reveal } from "@/components/ui/Reveal";

export function ScienceSection() {
  const articles = getJournalArticles().slice(0, 3);
  return (
    <section className="bg-ivory pb-20 pt-20 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal className="mb-16 max-w-2xl md:mb-24">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">07 / The EVLV Research Journal</p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-charcoal md:text-5xl">
            Research deserves
            <br />
            better standards.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-soft-gray md:text-lg">
            Explore how EVLV approaches testing, documentation, handling and transparency across every research
            compound.
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
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
              <h3 className="mt-2 font-display text-xl font-medium text-charcoal">{article.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft-gray">{article.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-sage-deep">
                Read Article <i className="ri-arrow-right-line transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </Reveal>

        <div className="mt-12 text-center">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sage-deep transition hover:text-charcoal"
          >
            View All Journal Articles <i className="ri-arrow-right-line" />
          </Link>
        </div>
      </div>
    </section>
  );
}
