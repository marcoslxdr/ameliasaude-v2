"use client";

import Link from "next/link";

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="rounded-2xl border border-[var(--amelia-line)] bg-white p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b6bb2] mb-3">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="rounded-full border border-[var(--amelia-line)] px-3 py-1.5 text-xs font-medium text-[#4f4f63] transition-colors hover:border-[var(--amelia-purple)] hover:bg-[var(--amelia-purple-faint)] hover:text-[var(--amelia-deep)]"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
