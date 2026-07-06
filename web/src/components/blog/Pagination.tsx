"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getButtonClassName } from "@/lib/button-styles";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className={getButtonClassName("pagination")}
        >
          Anterior
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={getButtonClassName(
            page === currentPage ? "pagination-active" : "pagination",
          )}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className={getButtonClassName("pagination")}
        >
          Próxima
        </Link>
      )}
    </div>
  );
}
