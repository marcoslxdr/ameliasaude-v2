import { getCategories, getAllTags } from "@/data/blog";
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

  return (
    <aside className="space-y-6 rounded-2xl border border-[var(--amelia-line)] bg-white p-5">
      <div className="mb-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7b6bb2]">
          Explore
        </p>
        <SearchInput onSearch={onSearch} initialValue={searchQuery} />
      </div>

      <CategoryFilter categories={categories} activeCategory={activeCategory} />
      <TagList tags={tags} />
    </aside>
  );
}
