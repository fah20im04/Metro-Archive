"use client";

import {
  BookOpen,
  FileQuestion,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

interface ContributionCardProps {
  title: string;
  courseName: string;
  subtitle?: string;
  type: "notes" | "question-papers";
  badges: string[];
  driveUrl: string;
  createdAt?: string;
}

export default function ContributionCard({
  title,
  courseName,
  subtitle,
  type,
  badges,
  driveUrl,
  createdAt,
}: ContributionCardProps) {
  const isNotes = type === "notes";

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently uploaded";

  return (
    <div className="card rounded-xl p-5 transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isNotes ? <BookOpen size={21} /> : <FileQuestion size={21} />}
        </div>

        <span className="rounded-lg bg-surface-secondary px-2.5 py-1 text-xs text-muted">
          {isNotes ? "Notes" : "Question Paper"}
        </span>
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
          {formattedDate}
        </div>

        <a
          href={driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition hover:underline"
        >
          Open {isNotes ? "Notes" : "Paper"}
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
