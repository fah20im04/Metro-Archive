"use client";

import {
  Bookmark,
  BookOpen,
  FileQuestion,
  ExternalLink,
  CalendarDays,
  X,
} from "lucide-react";

interface BookmarkCardProps {
  title: string;
  courseName: string;
  subtitle?: string;
  type: "notes" | "question-papers";
  badges: string[];
  driveUrl: string;
  bookmarkedAt: string;
  isRemoving: boolean;
  onRemove: () => void;
}

export default function BookmarkCard({
  title,
  courseName,
  subtitle,
  type,
  badges,
  driveUrl,
  bookmarkedAt,
  isRemoving,
  onRemove,
}: BookmarkCardProps) {
  const isNotes = type === "notes";

  return (
    <div className="card rounded-xl p-5 transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isNotes ? <BookOpen size={21} /> : <FileQuestion size={21} />}
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          title="Remove bookmark"
          aria-label="Remove bookmark"
          className="rounded-lg p-2 text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRemoving ? (
            <span className="block h-[19px] w-[19px] animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <Bookmark size={19} className="fill-primary" />
          )}
        </button>
      </div>

      <h3 className="mt-4 font-semibold leading-snug">{title}</h3>

      <p className="mt-2 text-sm text-muted">{courseName}</p>

      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-lg bg-surface-secondary px-2.5 py-1 text-xs text-muted"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <CalendarDays size={14} />
          <span>{bookmarkedAt}</span>
        </div>

        <a
          href={driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition hover:underline"
        >
          {isNotes ? "Open Notes" : "Open Paper"}
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
