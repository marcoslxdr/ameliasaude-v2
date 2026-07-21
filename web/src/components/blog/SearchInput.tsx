"use client";

import { useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function SearchInput({ onSearch, initialValue = "" }: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar artigos..."
        className="w-full rounded-xl border border-[#d8caee] bg-white px-4 py-3 pr-11 text-sm font-light text-[#1a1a1a] placeholder:text-[#b7a9d5] focus:border-[var(--amelia-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--amelia-purple)]/25 transition-colors"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--amelia-deep)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--amelia-purple)]"
      >
        Buscar
      </button>
    </form>
  );
}
