"use client";

import Link from "next/link";

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
    <div className="rounded-2xl border border-[var(--amelia-line)] bg-white p-4">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7b6bb2]">
        Categorias
      </h3>
      <div className="space-y-1.5">
        <Link
          href="/blog"
          className={`block rounded-full border px-3 py-2 text-sm transition-colors ${
            !activeCategory
              ? "border-[var(--amelia-deep)] bg-[var(--amelia-purple-faint)] text-[var(--amelia-deep)] font-medium"
              : "border-[var(--amelia-line)] text-[#525266] hover:border-[var(--amelia-purple)] hover:text-[var(--amelia-deep)]"
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/blog?category=${encodeURIComponent(cat.name)}`}
            className={`block rounded-full border px-3 py-2 text-sm transition-colors ${
              activeCategory === cat.name
                ? "border-[var(--amelia-deep)] bg-[var(--amelia-purple-faint)] text-[var(--amelia-deep)] font-medium"
                : "border-[var(--amelia-line)] text-[#525266] hover:border-[var(--amelia-purple)] hover:text-[var(--amelia-deep)]"
            }`}
          >
            {cat.name} <span className="text-[11px] text-[#9a8dbb]">({cat.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
