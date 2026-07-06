import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { getPostBySlug, blogPosts } from "@/data/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };
  return {
    title: `${post.title} — Blog Amélia Saúde`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative w-full" style={{ height: "clamp(280px, 45vh, 520px)" }}>
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Post Content */}
        <article className="mx-auto max-w-[680px] px-4" style={{ padding: "clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)" }}>
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 font-sans text-sm font-light tracking-wide text-[#7b6bb2] transition-colors duration-200 hover:text-[#5e4985]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar ao Blog
          </Link>

          {/* Category */}
          <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7b6bb2]">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="mt-4 font-display text-[clamp(2.5rem, 6vw, 4.5rem)] font-normal tracking-[-0.03em] leading-[1.08] text-[#7b6bb2]">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex items-center gap-4 font-sans text-sm text-[#8a8a8a]">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-[#8a8a8a]" />
            <span>{post.readTime} de leitura</span>
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-16 bg-[#e4dcf5]" />

          {/* Body */}
          <div className="font-sans text-[1.125rem] font-light leading-[1.85] text-[#3a3450]">
            {post.content.map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-6" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-16 bg-[#e4dcf5]" />

          {/* CTA */}
          <div className="text-center">
            <p className="mb-6 font-display text-xl tracking-[-0.01em] text-[#1a1a1a]">
              Gostou deste conteúdo?
            </p>
            <Button href="/#contato" variant="primary">
              Fale conosco
            </Button>
          </div>
        </article>

        {/* Related Posts */}
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
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
