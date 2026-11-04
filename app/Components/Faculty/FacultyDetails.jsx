"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowBigUp, ArrowLeft, Info, Star } from "lucide-react";

/**
 * Props:
 *  - faculty: { _id, name, designation, profileImage, departments: [{ _id, name }],
 *               upvoteCount?, avgRating?, reviewCount? }
 *  - reviews: approved reviews only, [{ _id, rating, reviewText, createdAt }]
 *    (reviews are anonymous in the UI: no student name shown)
 */
export default function FacultyDetails({ faculty, reviews = [] }) {
    const {
        _id,
        name,
        designation,
        profileImage,
        departments = [],
        upvoteCount = 0,
        avgRating = null,
        reviewCount = reviews.length,
    } = faculty;

    const [imgFailed, setImgFailed] = useState(false);
    // local-only until the votes API exists
    const [upvoted, setUpvoted] = useState(false);

    const initials = (name || "")
        .replace(/^(Professor|Prof\.|Dr\.|Ms\.|Mr\.|Md\.)\s*/gi, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <Link
                href="/faculty"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
            >
                <ArrowLeft size={16} />
                Back to faculty
            </Link>

            {/* Profile header */}
            <section className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-5">
                    {profileImage && !imgFailed ? (
                        <img
                            src={profileImage}
                            alt={name}
                            onError={() => setImgFailed(true)}
                            className="h-28 w-28 shrink-0 rounded-full border border-border object-cover"
                        />
                    ) : (
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-border bg-background text-2xl font-semibold text-muted-foreground">
                            {initials || "?"}
                        </div>
                    )}

                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {name}
                        </h1>
                        {designation && (
                            <p className="mt-1 text-sm text-muted-foreground">{designation}</p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
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

                <button
                    type="button"
                    onClick={() => setUpvoted((v) => !v)}
                    aria-pressed={upvoted}
                    className={`flex shrink-0 items-center gap-1.5 self-start rounded-xl border px-4 py-2 text-sm font-medium transition ${upvoted
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-background text-foreground hover:border-primary"
                        }`}
                >
                    <ArrowBigUp size={20} className={upvoted ? "fill-white" : ""} />
                    {upvoteCount + (upvoted ? 1 : 0)}
                </button>
            </section>

            {/* Rating summary */}
            <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
                <h2 className="text-lg font-semibold text-foreground">Rating summary</h2>
                <div className="mt-3 flex items-center gap-2">
                    <Star
                        size={28}
                        className={
                            avgRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }
                    />
                    {avgRating ? (
                        <>
                            <span className="text-3xl font-bold text-foreground">
                                {avgRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                / 5 · {reviewCount} review{reviewCount === 1 ? "" : "s"}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-muted-foreground">No ratings yet</span>
                    )}
                </div>
            </section>

            {/* Reviews */}
            <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
                <h2 className="text-lg font-semibold text-foreground">Student reviews</h2>

                <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p>
                        Only reviews approved by moderators are shown here. New reviews may
                        take time to appear.
                    </p>
                </div>

                {reviews.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No reviews yet.
                    </p>
                ) : (
                    <ul className="mt-4 flex flex-col gap-4">
                        {reviews.map((r) => (
                            <li
                                key={r._id}
                                className="rounded-xl border border-border bg-background p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-0.5" aria-label={`${r.rating} out of 5`}>
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <Star
                                                key={n}
                                                size={16}
                                                className={
                                                    n <= r.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-muted-foreground"
                                                }
                                            />
                                        ))}
                                    </div>
                                    {r.createdAt && (
                                        <time className="text-xs text-muted-foreground">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </time>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-foreground">{r.reviewText}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {/* TODO: review submission form for eligible students (POST /faculty/:id/reviews) */}
            </section>
        </main>
    );
}