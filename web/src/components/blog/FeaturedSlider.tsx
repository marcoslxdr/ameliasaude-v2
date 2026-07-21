"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BlogPost } from "@/data/blog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedSliderProps {
  posts: BlogPost[];
}

export function FeaturedSlider({ posts }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goTo = useCallback((index: number) => {
    if (index < 0) {
      setCurrentIndex(posts.length - 1);
    } else if (index >= posts.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  }, [posts.length]);

  const next = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const prev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Autoplay
  useEffect(() => {
    if (isHovered || posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, posts.length]);

  if (posts.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides container */}
      <div className="overflow-hidden rounded-[1.5rem] bg-[var(--amelia-deep)]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.slug} className="w-full flex-shrink-0">
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="grid min-h-[420px] grid-cols-1 md:min-h-[440px] md:grid-cols-[1.18fr_0.82fr]">
                  {/* Image */}
                  <div className="relative min-h-[250px] overflow-hidden md:min-h-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between p-7 text-white md:p-10">
                    <span className="inline-flex self-start text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                      {post.category}
                    </span>

                    <div className="mt-12 md:mt-0">
                      <h2 className="font-display text-[clamp(2rem,3.2vw,3rem)] leading-[1.02] tracking-[-0.035em] transition-colors group-hover:text-white/80">
                        {post.title}
                      </h2>
                      <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-white/75">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-4 text-[11px] tracking-wide text-white/60">
                      <span>{post.date}</span>
                      <span>{post.readTime} de leitura</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-[calc(50%-1.25rem)] z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--amelia-deep)] md:flex md:left-auto md:right-20 md:top-6"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-[calc(50%-1.25rem)] z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--amelia-deep)] md:flex md:top-6"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {posts.length > 1 && (
        <div className="mt-5 flex gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[var(--amelia-purple)]"
                  : "w-2 bg-[var(--amelia-purple-mist)] hover:bg-[var(--amelia-lilac)]"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
