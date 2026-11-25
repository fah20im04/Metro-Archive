"use client";

import {
  GraduationCap,
  Users,
  Heart,
  Bookmark,
  ArrowUpRight,
} from "lucide-react";

export interface ResourceItem {
  _id: string;
  resourceTitle: string;
  courseName: string;
  courseCode: string;
  departmentCode: string;
  resourceType: string;
  driveUrl: string;
  likeCount: number;
  uploadedBy?: {
    _id?: string;
    name?: string;
    universityId?: string;
  } | null;
}

interface ResourceCardProps {
  resource: ResourceItem;
  hasLiked: boolean;
  likeCount: number;
  isLiking: boolean;
  onLike: (resourceId: string) => void;
  isBookmarked?: boolean;
  bookmarkCount?: number;
  isBookmarking?: boolean;
  onBookmark?: (resourceId: string) => void;
}

export default function ArchiveCard({
  resource,
  hasLiked,
  likeCount,
  isLiking,
  onLike,
  isBookmarked = false,
  bookmarkCount = 0,
  isBookmarking = false,
  onBookmark,
}: ResourceCardProps) {
  return (
    <div className="card group flex flex-col rounded-xl p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      {/* Card Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
          <GraduationCap size={25} />
        </div>

        <span className="rounded-lg bg-surface-secondary px-3 py-1.5 text-xs font-medium text-muted">
          {resource.departmentCode || "General"}
        </span>
      </div>

      {/* Resource Details */}
      <h3 className="text-lg font-bold tracking-tight">
        {resource.resourceTitle}
      </h3>

      <p className="mt-1 text-xs font-medium text-primary">
        {resource.courseCode} · {resource.courseName}
      </p>

      <div className="mt-3">
        <span className="inline-flex rounded-md bg-accent-light px-2.5 py-1 text-xs font-medium text-accent">
          {resource.resourceType}
        </span>
      </div>

      {/* Uploader, Like and Bookmark */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <Users size={15} className="shrink-0" />
          <span className="truncate">
            {resource.uploadedBy?.name || "Unknown contributor"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Like */}
          <button
            type="button"
            onClick={() => onLike(resource._id)}
            disabled={isLiking}
            aria-label={hasLiked ? "Unlike resource" : "Like resource"}
            aria-pressed={hasLiked}
            className={`flex items-center gap-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              hasLiked ? "text-red-500" : "text-muted hover:text-red-500"
            }`}
          >
            <Heart size={15} fill={hasLiked ? "currentColor" : "none"} />
            {likeCount}
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={() => onBookmark?.(resource._id)}
            disabled={isBookmarking || !onBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
            aria-pressed={isBookmarked}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            className={`flex items-center gap-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isBookmarked ? "text-primary" : "text-muted hover:text-primary"
            }`}
          >
            <Bookmark size={17} fill={isBookmarked ? "currentColor" : "none"} />
            <span>{bookmarkCount}</span>
          </button>
        </div>
      </div>

      {/* Open Resource */}
      {resource.driveUrl ? (
        <a
          href={resource.driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition group-hover:border-primary group-hover:bg-primary group-hover:text-white"
        >
          View Note
          <ArrowUpRight size={17} />
        </a>
      ) : (
        <div className="mt-5 rounded-lg border border-border px-4 py-2.5 text-center text-sm text-muted">
          Note link unavailable
        </div>
      )}
    </div>
  );
}
