"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  X,
  Clock,
  MessageSquare,
  GraduationCap,
  User,
  Loader2,
} from "lucide-react";

import { updateFacultyReviewStatusAction } from "@/actions/facultyReview";

type ReviewStatus = "pending" | "approved" | "rejected";

interface FacultyReviewItem {
  _id: string;
  title: string;
  description: string;
  status: ReviewStatus;
  createdAt: string;
  facultyId: {
    _id: string;
    name: string;
    designation?: string;
  } | null;
  userId: {
    _id: string;
    name: string;
    universityId: string;
    departmentName?: string | null;
    batch?: string | null;
  } | null;
}

interface Props {
  initialReviews: FacultyReviewItem[];
}

const filters = [
  { label: "All Reviews", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

export default function FacultyReviewManagement({ initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeFilter, setActiveFilter] = useState<"all" | ReviewStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredReviews =
    activeFilter === "all"
      ? reviews
      : reviews.filter((review) => review.status === activeFilter);

  const counts = {
    all: reviews.length,
    pending: reviews.filter((review) => review.status === "pending").length,
    approved: reviews.filter((review) => review.status === "approved").length,
    rejected: reviews.filter((review) => review.status === "rejected").length,
  };

  async function handleStatusChange(reviewId: string, status: ReviewStatus) {
    setUpdatingId(reviewId);

    try {
      const result = await updateFacultyReviewStatusAction({
        reviewId,
        status,
      });

      if (!result.success) {
        toast.error(result.message || "Failed to update review.");
        return;
      }

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? { ...review, status } : review,
        ),
      );

      toast.success(result.message);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusStyle(status: ReviewStatus) {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">CONTENT MODERATION</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Faculty Reviews
        </h1>

        <p className="mt-2 text-sm text-muted">
          Review student feedback and manage its publication status.
        </p>
      </div>

      {/* Review Statistics */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`card rounded-xl border p-4 text-left transition ${
              activeFilter === filter.value
                ? "border-primary bg-primary/5"
                : "hover:border-primary/40"
            }`}
          >
            <p className="text-xs text-muted">{filter.label}</p>

            <p className="mt-2 text-2xl font-bold">{counts[filter.value]}</p>
          </button>
        ))}
      </div>

      {/* Reviews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            {activeFilter === "all"
              ? "All Reviews"
              : `${activeFilter.charAt(0).toUpperCase()}${activeFilter.slice(1)} Reviews`}
          </h2>

          <span className="text-xs text-muted">
            {filteredReviews.length} results
          </span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="card rounded-xl border p-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-muted" />

            <h3 className="mt-3 font-semibold">No reviews found</h3>

            <p className="mt-1 text-sm text-muted">
              There are no reviews in this category.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => {
              const isUpdating = updatingId === review._id;

              return (
                <article
                  key={review._id}
                  className="card space-y-4 rounded-xl border p-5"
                >
                  {/* Review Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold">{review.title}</h3>

                      <p className="mt-1 text-xs text-muted">
                        Submitted{" "}
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                        review.status,
                      )}`}
                    >
                      {review.status}
                    </span>
                  </div>

                  {/* Review Description */}
                  <p className="whitespace-pre-wrap text-sm leading-6 text-muted">
                    {review.description}
                  </p>

                  {/* Student and Faculty Details */}
                  <div className="grid gap-3 rounded-lg bg-muted/10 p-3 sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-xs text-muted">Faculty Member</p>

                        <p className="truncate text-sm font-medium">
                          {review.facultyId?.name || "Faculty unavailable"}
                        </p>

                        {review.facultyId?.designation && (
                          <p className="text-xs text-muted">
                            {review.facultyId.designation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-xs text-muted">Submitted By</p>

                        <p className="truncate text-sm font-medium">
                          {review.userId?.name || "Student unavailable"}
                        </p>

                        <p className="text-xs text-muted">
                          {review.userId?.universityId || "No university ID"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      Review moderation
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {review.status !== "approved" && (
                        <button
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(review._id, "approved")
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </button>
                      )}

                      {review.status !== "rejected" && (
                        <button
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(review._id, "rejected")
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          Reject
                        </button>
                      )}

                      {review.status !== "pending" && (
                        <button
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(review._id, "pending")
                          }
                          className="rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-muted disabled:opacity-50"
                        >
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
