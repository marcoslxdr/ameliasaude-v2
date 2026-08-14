"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { getPublishedPosts } from "@/data/blog";
import { HeroBackground } from "@/components/ui/HeroBackground";

const visiblePosts = getPublishedPosts().slice(0, 3);

export function Blog() {
  return (
    <section
      id="blog"
      className="relative"
      style={{ padding: "clamp(5rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)" }}
    >
      <HeroBackground variant="haze" />
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-14 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="mx-auto max-w-[800px] font-display font-normal text-[var(--amelia-deep)]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Tudo sobre os planos
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-[560px] font-sans font-light leading-relaxed text-[var(--amelia-body)]"
            style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
          >
            Guias práticos para você comparar, contratar e tirar dúvidas sobre planos de saúde.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visiblePosts.map((post, i) => (
            <motion.div
              key={post.slug}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-[#e4dcf5] bg-white shadow-sm transition-all duration-300 hover:border-[#c8bde6] hover:shadow-md"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-7">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--amelia-purple)]">
                    {post.category}
                  </span>
                  <h3 className="mt-3 font-sans font-medium text-[clamp(1.5rem, 2vw, 1.75rem)] leading-[1.25] tracking-[-0.01em] text-[var(--amelia-deep)] transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="mt-4 font-sans font-light leading-relaxed text-[#5c5470] text-[0.95rem] line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#e4dcf5] pt-4 font-sans text-[11px] text-[#8a8a8a]">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-[#8a8a8a]" />
                    <span>{post.readTime} de leitura</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-12 text-center"
        >
          <Button href="/blog" variant="outline">
            Ver todos os artigos
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
