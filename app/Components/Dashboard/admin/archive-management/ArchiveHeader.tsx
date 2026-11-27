"use client";

import { BookOpen, RefreshCw } from "lucide-react";

interface Props {
  onRefresh: () => void;
  loading: boolean;
  refreshing: boolean;
}

export default function ArchiveHeader({
  onRefresh,
  loading,
  refreshing,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen size={15} />
          <span>Admin Dashboard</span>
          <span>/</span>
          <span>Archive Management</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Archive Management
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage student resources and question paper submissions.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading || refreshing}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
      >
        <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
        Refresh
      </button>
    </div>
  );
}
