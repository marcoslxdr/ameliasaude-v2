import Link from "next/link";
import { getCategories, getAllTags } from "@/data/blog";
import { planosLinksForCategory } from "@/lib/planos-schema";
import { SearchInput } from "./SearchInput";
import { CategoryFilter } from "./CategoryFilter";
import { TagList } from "./TagList";

interface BlogSidebarProps {
  activeCategory?: string;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function BlogSidebar({ activeCategory, onSearch, searchQuery }: BlogSidebarProps) {
  const categories = getCategories();
  const tags = getAllTags();
  const planosLinks = planosLinksForCategory(activeCategory ?? "");

  return (
    <aside className="space-y-6 rounded-2xl border border-[var(--amelia-line)] bg-white p-5">
      <div className="mb-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7b6bb2]">
          Explore
        </p>
        <SearchInput onSearch={onSearch} initialValue={searchQuery} />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7b6bb2]">
          Planos Amélia
        </p>
        <ul className="space-y-2">
          {planosLinks.map((link) => (
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
      </div>

      <CategoryFilter categories={categories} activeCategory={activeCategory} />
      <TagList tags={tags} />
    </aside>
  );
}
