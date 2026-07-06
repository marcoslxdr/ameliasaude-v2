"use client";

import Link from "next/link";
import { getButtonClassName } from "@/lib/button-styles";

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#7b6bb2]">
        Categorias
      </h3>
      <div className="space-y-1">
        <Link
          href="/blog"
          className={getButtonClassName(
            !activeCategory ? "pagination-active" : "pagination",
            "md",
            "block w-full text-left font-medium",
          )}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/blog?category=${encodeURIComponent(cat.name)}`}
            className={getButtonClassName(
              activeCategory === cat.name ? "pagination-active" : "pagination",
              "md",
              "block w-full text-left font-medium",
            )}
          >
            {cat.name} ({cat.count})
          </Link>
        ))}
      </div>
    </div>
  );
}
