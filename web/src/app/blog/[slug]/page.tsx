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

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden">
          <img src={post.image} alt={post.title} className="h-[38vh] min-h-[260px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080510]/75 via-[#080510]/35 to-transparent" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end px-6 pb-10 pt-28">
            <Link
              href="/blog"
              className="mb-7 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Voltar ao blog
            </Link>

            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/70 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                {post.category}
              </span>
              <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3.2rem)] leading-[1.08] tracking-[-0.025em] text-white">
                {post.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/95">
                {post.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/90">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime} de leitura</span>
              </div>
            </div>
          </div>
        </section>

        <article className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
          <div className="rounded-3xl border border-[var(--amelia-line)] bg-white p-6 shadow-sm sm:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[var(--amelia-line)] px-2.5 py-1 text-[var(--amelia-body)] transition-colors hover:border-[var(--amelia-purple)] hover:text-[var(--amelia-deep)]"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="font-sans text-[1.07rem] leading-[1.9] text-[#3a3450]">
              {post.content.map((paragraph, i) => (
                <p key={i} className={i > 0 ? "mt-7" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="font-display text-[clamp(1.5rem,4vw,2rem)] tracking-[-0.02em] text-[#1a1a1a]">
              Gostou do conteúdo? Fale com nosso time.
            </p>
            <p className="mt-3 text-sm text-[#54526a]">
              Tire dúvidas sobre plano ideal, telemedicina e serviços de atendimento.
            </p>
            <div className="mt-6">
              <Button href="/#contato" variant="primary">
                Falar com a equipe
              </Button>
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="border-t border-[var(--amelia-line)] bg-[#f8f6ff] py-14 sm:py-16">
            <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] leading-[1.05] tracking-[-0.02em] text-[var(--amelia-deep)]">
                  Leia mais
                </h2>
                <Link href="/blog" className="text-sm font-semibold text-[var(--amelia-deep)] underline underline-offset-4">
                  Ver todos os artigos
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group rounded-2xl border border-[var(--amelia-line)] bg-white p-4 transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <span className="inline-flex rounded-full bg-[var(--amelia-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--amelia-deep)]">
                      {rp.category}
                    </span>
                    <h3 className="mt-2 font-display text-[1.15rem] leading-[1.2] tracking-[-0.02em] text-[#1a1a1a] group-hover:text-[var(--amelia-deep)]">
                      {rp.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#8a8a8a]">
                      <span>{rp.date}</span>
                      <span>•</span>
                      <span>{rp.readTime} de leitura</span>
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
