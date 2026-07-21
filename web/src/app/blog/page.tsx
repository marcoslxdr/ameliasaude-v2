"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { blogPosts, BlogPost } from "@/data/blog";
import { PostCard } from "@/components/blog/PostCard";
import { FeaturedSlider } from "@/components/blog/FeaturedSlider";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { Pagination } from "@/components/blog/Pagination";

const POSTS_PER_PAGE = 6;

function BlogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const pageParam = Number.parseInt(searchParams.get("page") || "1", 10);
  const categoryParam = searchParams.get("category");
  const tagParam = searchParams.get("tag");

  const filteredPosts = useMemo(() => {
    let posts: BlogPost[] = [...blogPosts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.content.some((p) => p.toLowerCase().includes(q)),
      );
    }

    if (categoryParam) {
      posts = posts.filter((post) => post.category === categoryParam);
    }

    if (tagParam) {
      posts = posts.filter((post) => post.tags.includes(tagParam));
    }

    return posts;
  }, [searchQuery, categoryParam, tagParam]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : Math.min(pageParam, totalPages);
  const paginatedPosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const isFiltered = Boolean(searchQuery || categoryParam || tagParam);
  const featuredPosts = page === 1 && !isFiltered ? blogPosts.slice(0, 3) : [];
  const listPosts = paginatedPosts;

  const hasNoResults = filteredPosts.length === 0;
  const activeLabel = categoryParam || tagParam || searchQuery;
  const activeLabelType = categoryParam
    ? "Categoria"
    : tagParam
      ? "Tag"
      : searchQuery
        ? "Busca"
        : "";

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categoryParam) params.set("category", categoryParam);
    if (tagParam) params.set("tag", tagParam);
    params.delete("page");
    router.push(`/blog${params.toString() ? `?${params.toString()}` : ""}`);
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        <section className="overflow-hidden bg-gradient-to-b from-[var(--amelia-surface)] via-white to-white pt-28 pb-20 md:pt-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <header className="mb-12 max-w-3xl pt-5 md:mb-16 md:pt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--amelia-purple)]">
                Conteúdo editorial
              </p>
              <h1 className="mt-4 font-display text-[clamp(3rem,7vw,5.4rem)] leading-[0.94] tracking-[-0.045em] text-[var(--amelia-deep)]">
                Saúde em boa companhia.
              </h1>
              <p className="mt-6 max-w-xl text-[1.05rem] font-light leading-relaxed text-[var(--amelia-body)] md:text-[1.15rem]">
                Informação prática para escolhas mais tranquilas, todos os dias.
              </p>

              {isFiltered && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--amelia-line)] bg-[var(--amelia-soft)] px-4 py-2 text-sm text-[var(--amelia-deep)]">
                  <span className="font-semibold">{activeLabelType}:</span>
                  <span>{activeLabel}</span>
                  <button
                    onClick={() => handleSearch("")}
                    className="ml-2 rounded-full border border-[var(--amelia-line)] bg-white px-2 py-1 text-[11px] hover:border-[var(--amelia-purple)]"
                  >
                    limpar
                  </button>
                </div>
              )}
            </header>

            {!hasNoResults && featuredPosts.length > 0 ? (
              <section className="mb-16 md:mb-24">
                <div className="mb-5 flex items-center justify-between border-b border-[var(--amelia-line)] pb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--amelia-purple)]">
                    Em destaque
                  </p>
                  <span className="text-xs text-[var(--amelia-muted)]">Seleção Amélia</span>
                </div>
                <FeaturedSlider posts={featuredPosts} />
              </section>
            ) : null}

            <div className="flex flex-col gap-14 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1">
                {hasNoResults ? (
                  <div className="border-y border-[var(--amelia-line)] py-14 text-center">
                    <p className="text-[var(--amelia-body)]">
                      Nenhum resultado encontrado para{" "}
                      <span className="font-semibold text-[var(--amelia-deep)]">&quot;{searchQuery || categoryParam || tagParam}&quot;</span>.
                    </p>
                    <button
                      onClick={() => handleSearch("")}
                      className="mt-4 rounded-full border border-[var(--amelia-line)] bg-[var(--amelia-soft)] px-4 py-2 text-sm text-[var(--amelia-deep)] transition hover:bg-[var(--amelia-purple-faint)]"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex items-end justify-between border-b border-[var(--amelia-line)] pb-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--amelia-purple)]">
                          Para sua rotina
                        </p>
                        <h2 className="mt-1 font-display text-3xl tracking-[-0.03em] text-[var(--amelia-deep)]">
                          Leituras recentes
                        </h2>
                      </div>
                      <span className="hidden text-xs text-[var(--amelia-muted)] sm:block">{filteredPosts.length} artigos</span>
                    </div>

                    <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2">
                      {listPosts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                      ))}
                    </div>

                    <Pagination currentPage={page} totalPages={totalPages} />
                  </>
                )}
              </div>

              <div className="hidden lg:block lg:w-[280px] lg:shrink-0">
                <div className="sticky top-28">
                  <BlogSidebar
                    activeCategory={categoryParam || undefined}
                    onSearch={handleSearch}
                    searchQuery={searchQuery}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <BlogPageContent />
    </Suspense>
  );
}
