"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowBigUp, Star } from "lucide-react";

/**
 * Props:
 *  - faculty: {
 *      _id, name, designation, profileImage,
 *      departments?: [{ _id, name }],   // populated from departmentIds
 *      upvoteCount?: number,            // computed from facultyVotes
 *      avgRating?: number | null,       // approved reviews only
 *      reviewCount?: number,            // approved reviews only
 *    }
 *  - upvoted: boolean            whether the current user has upvoted
 *  - onUpvote(facultyId): optional; if omitted the upvote is display-only
 */
export default function FacultyCard({ faculty, upvoted = false, onUpvote }) {
  const {
    _id,
    name,
    designation,
    profileImage,
    departments = [],
    upvoteCount = 0,
    avgRating = null,
    reviewCount = 0,
  } = faculty;

  const [imgFailed, setImgFailed] = useState(false);

  const href = `/faculty/${_id}`;
  const initials = (name || "")
    .replace(/^(Professor|Prof\.|Dr\.|Ms\.|Mr\.|Md\.)\s*/gi, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-black/5 transition-colors duration-200 hover:border-primary sm:flex-row sm:items-stretch sm:justify-between">
      {/* Left: photo + info */}
      <div className="flex min-w-0 items-start gap-4">
        <Link
          href={href}
          aria-label={`View ${name}'s profile`}
          className="shrink-0"
        >
          {profileImage && !imgFailed ? (
            // plain <img> so no next/image remotePatterns config is needed
            <img
              src={profileImage}
              alt={name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-20 w-20 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-background text-lg font-semibold text-muted-foreground">
              {initials || "?"}
            </div>
          )}
        </Link>

        <div className="min-w-0">
          <Link href={href}>
            <h3 className="truncate text-lg font-semibold text-foreground hover:text-primary">
              {name}
              
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1.5 text-sm">
            <Star
              size={16}
              className={
                avgRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }
            />
            {avgRating ? (
              <>
                <span className="font-medium text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">({reviewCount})</span>
              </>
            ) : (
              <span className="text-muted-foreground">No ratings yet</span>
            )}
          </div>

          {/* Designation + department */}
          <div className="mt-3 flex flex-wrap gap-2">
            {designation && (
              <span className="max-w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                {designation}
              </span>
            )}
            {departments.map((d) => (
              <span
                key={d._id}
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
              >
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: upvotes + view reviews */}
      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-between">
        <button
          type="button"
          onClick={() => onUpvote?.(_id)}
          disabled={!onUpvote}
          aria-pressed={upvoted}
          aria-label={`${upvoteCount} upvotes`}
          className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-sm font-medium transition disabled:cursor-default ${
            upvoted
              ? "border-primary bg-primary text-white"
              : "border-border bg-background text-foreground enabled:hover:border-primary"
          }`}
        >
          <ArrowBigUp size={18} className={upvoted ? "fill-white" : ""} />
          {upvoteCount}
        </button>

        <Link
          href={href}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white! transition hover:bg-blue-700"
        >
          View reviews
        </Link>
      </div>
    </article>
  );
}
