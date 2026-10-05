import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getJournalArticles, getJournalArticleBySlug } from "@/lib/journal-data";

export function generateStaticParams() {
  return getJournalArticles().map((a) => ({ slug: a.slug }));
}

const SITE_URL = "https://evlvpeptides.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticleBySlug(slug);
  if (!article) return {};
  const url = `${SITE_URL}/journal/${article.slug}`;
  return {
    title: `${article.title} | EVLV Journal`,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedDate,
      images: [{ url: `${SITE_URL}${article.image}`, width: 1200, height: 675, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [`${SITE_URL}${article.image}`],
    },
  };
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getJournalArticleBySlug(slug);
  if (!article) notFound();

  const more = getJournalArticles().filter((a) => a.slug !== slug).slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [`${SITE_URL}${article.image}`],
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: { "@type": "Organization", name: "EVLV" },
    publisher: {
      "@type": "Organization",
      name: "EVLV",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo/evlv-logo-light.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/journal/${article.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/journal` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/journal/${article.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mx-auto max-w-[900px] px-4 pt-6 md:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-charcoal/50">
          <Link href="/" className="transition hover:text-charcoal">
            Home
          </Link>
          <i className="ri-arrow-right-s-line" />
          <Link href="/journal" className="transition hover:text-charcoal">
            Journal
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="font-medium text-charcoal">{article.title}</span>
        </nav>
      </div>

      <article className="mx-auto max-w-[760px] px-4 py-10 md:px-8 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">{article.label}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-charcoal md:text-5xl">{article.title}</h1>
        <div className="mt-4 flex items-center gap-3 text-xs text-charcoal/50">
          <time dateTime={article.publishedDate}>
            {new Date(article.publishedDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <span>&middot;</span>
          <span>{article.readTime}</span>
        </div>

        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-sage-mist">
          <Image src={article.image} alt={article.title} width={1200} height={675} className="h-full w-full object-cover" priority />
        </div>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-charcoal/80 md:text-lg">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {article.cta && (
          <Link
            href={article.cta.href}
            className="mt-10 inline-flex items-center gap-2 rounded-md bg-copper px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-copper-light"
          >
            {article.cta.label} <i className="ri-arrow-right-line" />
          </Link>
        )}

        <div className="mt-12 rounded-lg border border-stone bg-ivory-soft p-5 text-xs leading-relaxed text-charcoal/50">
          For research use only. Nothing in this article is dosing, medical or veterinary guidance.
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-stone bg-ivory-soft py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            <h2 className="mb-8 font-display text-2xl font-semibold text-charcoal md:text-3xl">More from the Journal</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {more.map((a) => (
                <Link key={a.slug} href={`/journal/${a.slug}`} className="group flex items-center gap-5 rounded-lg bg-ivory p-4">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-sage-mist">
                    <Image src={a.image} alt={a.title} width={280} height={200} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-copper">{a.label}</p>
                    <p className="mt-1 font-display text-base font-medium text-charcoal">{a.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
