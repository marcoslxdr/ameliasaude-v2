import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogCta } from "@/components/blog/BlogCta";
import { StructuredData } from "@/components/StructuredData";
import { getPostBySlug, getPublishedPosts, getPostIsoDate } from "@/data/blog";
import { planosLinksForCategory } from "@/lib/planos-schema";

const SITE_URL = "https://www.ameliasaude.com.br";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

/** Runtime gating by publishAt — unpublished slugs must 404 after deploy. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };

  const url = `${SITE_URL}/blog/${post.slug}`;
  const published = getPostIsoDate(post);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: published,
      modifiedTime: post.updatedAt ? getPostIsoDate({ ...post, date: post.updatedAt }) : published,
      authors: post.author ? [post.author] : undefined,
      section: post.category,
      tags: post.tags,
      images: [{ url: post.image, alt: post.title }],
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getPublishedPosts().filter((p) => p.slug !== slug).slice(0, 2);
  const published = getPostIsoDate(post);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const cta = post.cta ?? {
    label: "Fale conosco",
    href: "/#contato",
    event: "blog_cta_contato",
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StructuredData
        type="Article"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: published,
          dateModified: post.updatedAt
            ? getPostIsoDate({ ...post, date: post.updatedAt })
            : published,
          author: { "@type": "Organization", name: post.author ?? "Amélia Saúde" },
          publisher: {
            "@type": "Organization",
            name: "Amélia Saúde",
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/logo-amelia-site.png`,
            },
          },
          url,
          articleSection: post.category,
          keywords: post.tags.join(", "),
          inLanguage: "pt-BR",
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url },
          ],
        }}
      />

      <Navigation />
      <main className="flex-1">
        <div className="relative w-full" style={{ height: "clamp(280px, 45vh, 520px)" }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <article
          className="mx-auto max-w-[680px] px-4"
          style={{ padding: "clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)" }}
        >
          <nav aria-label="Breadcrumb" className="mb-8 font-sans text-sm text-[#8a8a8a]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#7b6bb2]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-[#7b6bb2]">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="line-clamp-1 text-[#5c5470]">{post.title}</li>
            </ol>
          </nav>

          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 font-sans text-sm font-light tracking-wide text-[#7b6bb2] transition-colors duration-200 hover:text-[#5e4985]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Voltar ao Blog
          </Link>

          <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7b6bb2]">
            {post.category}
          </span>

          <h1 className="mt-4 font-display text-[clamp(2.5rem, 6vw, 4.5rem)] font-normal tracking-[-0.03em] leading-[1.08] text-[#7b6bb2]">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 font-sans text-sm text-[#8a8a8a]">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-[#8a8a8a]" />
            <span>{post.readTime} de leitura</span>
            {post.author && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#8a8a8a]" />
                <span>{post.author}</span>
              </>
            )}
          </div>

          <div className="my-10 h-px w-16 bg-[#e4dcf5]" />

          <div className="font-sans text-[1.125rem] font-light leading-[1.85] text-[#3a3450] [&>p:first-of-type]:mt-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-10 mb-4 font-display text-2xl font-normal leading-tight text-[#7b6bb2]">
                    {children}
                  </h2>
                ),
                p: ({ children }) => <p className="mt-6">{children}</p>,
                ul: ({ children }) => (
                  <ul className="mt-6 list-disc space-y-2 pl-6">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mt-6 list-decimal space-y-2 pl-6">{children}</ol>
                ),
                a: ({ href, children }) => {
                  const isExternal =
                    href?.startsWith("http://") || href?.startsWith("https://");
                  return (
                    <a
                      href={href}
                      className="underline decoration-[#c8bde6] underline-offset-2 transition-colors hover:text-[#5e4985]"
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {children}
                    </a>
                  );
                },
                strong: ({ children }) => (
                  <strong className="font-medium">{children}</strong>
                ),
              }}
            >
              {post.content.join("\n\n")}
            </ReactMarkdown>
          </div>

          {post.sources && (
            <div className="mt-10 border-t border-[#e4dcf5] pt-6 text-sm text-[#6a6476]">
              <strong>Fontes e transparência</strong>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a className="underline" href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                Autor: {post.author}. Revisão: {post.reviewer}. Atualizado em {post.updatedAt}.
              </p>
              <p className="mt-2 text-xs leading-relaxed">
                Conteúdo educativo produzido pela Amélia Saúde (operadora). Não substitui proposta,
                contrato, consulta de rede nem orientação individual. Regras regulatórias: confira a
                ANS.
              </p>
            </div>
          )}

          <div className="my-10 h-px w-16 bg-[#e4dcf5]" />

          {/* AEO: internal links blog → product hubs */}
          <nav
            aria-label="Planos relacionados"
            className="mb-10 rounded-2xl border border-[#e4dcf5] bg-[#f8f7ff] p-6"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#7b6bb2]">
              Planos relacionados
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {planosLinksForCategory(post.category).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm font-medium text-[var(--amelia-deep)] underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-center">
            <p className="mb-6 font-display text-xl tracking-[-0.01em] text-[#1a1a1a]">
              Gostou deste conteúdo?
            </p>
            <BlogCta label={cta.label} href={cta.href} event={cta.event} slug={post.slug} />
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section
            className="border-t border-[#e4dcf5] bg-[#fafafa]"
            style={{ padding: "clamp(4rem, 8vh, 6rem) clamp(1.5rem, 5vw, 5rem)" }}
          >
            <div className="mx-auto max-w-[1200px]">
              <h2 className="mb-10 font-display text-[clamp(1.75rem, 4vw, 2.5rem)] font-normal tracking-[-0.025em] text-[#7b6bb2]">
                Veja também
              </h2>
              <div className="grid gap-8 sm:grid-cols-2">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group overflow-hidden rounded-2xl border border-[#e4dcf5] bg-white shadow-sm transition-all duration-300 hover:border-[#c8bde6] hover:shadow-md"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={rp.image}
                        alt={rp.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-6">
                      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7b6bb2]">
                        {rp.category}
                      </span>
                      <h3 className="mt-2 font-display text-[clamp(1.25rem, 2vw, 1.5rem)] font-normal leading-[1.15] tracking-[-0.02em] text-[#1a1a1a] group-hover:text-[#5e4985] transition-colors duration-200">
                        {rp.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-3 font-sans text-[11px] text-[#8a8a8a]">
                        <span>{rp.date}</span>
                        <span className="h-1 w-1 rounded-full bg-[#8a8a8a]" />
                        <span>{rp.readTime} de leitura</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
