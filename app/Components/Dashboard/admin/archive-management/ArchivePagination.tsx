"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "./types";

interface Props {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function ArchivePagination({
  pagination,
  onPageChange,
  onLimitChange,
}: Props) {
  if (pagination.totalItems === 0) return null;

  const start = (pagination.currentPage - 1) * pagination.limit + 1;

  const end = Math.min(
    pagination.currentPage * pagination.limit,
    pagination.totalItems,
  );

  return (
    <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Showing {start}–{end} of {pagination.totalItems} records
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pagination.currentPage <= 1}
          onClick={() => onPageChange(pagination.currentPage - 1)}
          className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeft size={17} />
        </button>

        <span className="min-w-16 text-center text-xs font-semibold text-foreground">
          {pagination.currentPage} / {pagination.totalPages}
        </span>

        <button
          type="button"
          disabled={pagination.currentPage >= pagination.totalPages}
          onClick={() => onPageChange(pagination.currentPage + 1)}
          className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted disabled:opacity-40"
        >
          <ChevronRight size={17} />
        </button>

        <select
          value={pagination.limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-lg border border-border bg-background px-2 py-2 text-xs text-foreground outline-none"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    </div>
  );
}
