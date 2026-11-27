"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  X,
  MessageSquare,
  Search,
  RotateCcw,
  RefreshCw,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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

const PAGE_SIZE = 10;

export default function FacultyReviewManagement({ initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeFilter, setActiveFilter] = useState<"all" | ReviewStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const counts = {
    all: reviews.length,
    pending: reviews.filter((review) => review.status === "pending").length,
    approved: reviews.filter((review) => review.status === "approved").length,
    rejected: reviews.filter((review) => review.status === "rejected").length,
  };

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      if (activeFilter !== "all" && review.status !== activeFilter) {
        return false;
      }

      if (!query) return true;

      return [
        review.title,
        review.description,
        review.facultyId?.name,
        review.userId?.name,
        review.userId?.universityId,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [reviews, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedReviews = filteredReviews.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const hasFilters = search.trim() !== "" || activeFilter !== "all";

  function resetFilters() {
    setSearch("");
    setActiveFilter("all");
    setPage(1);
  }

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
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";
      case "rejected":
        return "border-red-500/20 bg-red-500/10 text-red-600";
      default:
        return "border-amber-500/20 bg-amber-500/10 text-amber-600";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => {
              setActiveFilter(filter.value);
              setPage(1);
            }}
            className={`rounded-xl border p-4 text-left transition ${activeFilter === filter.value
                ? "border-primary bg-primary/5"
                : "border-border bg-surface hover:border-primary/40"
              }`}
          >
            <p className="text-xs text-muted">{filter.label}</p>

            <p className="mt-2 text-2xl font-bold">{counts[filter.value]}</p>
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Table Header */}
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {activeFilter === "all"
                  ? "All Reviews"
                  : `${activeFilter.charAt(0).toUpperCase()}${activeFilter.slice(1)} Reviews`}
              </h2>

              <p className="mt-1 text-sm text-muted">
                Search and moderate submitted reviews.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
            >
              <RefreshCw size={15} />
              Reset filters
            </button>
          </div>

          <div className="relative mt-5">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, faculty, student or ID..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-left">
            <thead className="bg-background/70">
              <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="px-6 py-4">Review</th>
                <th className="px-6 py-4">Faculty</th>
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {pagedReviews.length > 0 ? (
                pagedReviews.map((review) => {
                  const isUpdating = updatingId === review._id;
                  const isExpanded = expandedId === review._id;
                  const isLong = review.description.length > 90;

                  return (
                    <tr
                      key={review._id}
                      className="align-top transition-colors hover:bg-background/60"
                    >
                      {/* Review */}
                      <td className="max-w-[320px] px-6 py-4">
                        <p className="text-sm font-semibold text-foreground">
                          {review.title}
                        </p>

                        <p
                          className={`mt-1 whitespace-pre-wrap text-xs leading-5 text-muted ${isExpanded ? "" : "line-clamp-2"
                            }`}
                        >
                          {review.description}
                        </p>

                        {isLong && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : review._id)
                            }
                            className="mt-1 text-xs font-semibold text-primary"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </td>

                      {/* Faculty */}
                      <td className="px-6 py-4">
                        <p className="max-w-45 truncate text-sm font-medium text-foreground">
                          {review.facultyId?.name || "Faculty unavailable"}
                        </p>

                        {review.facultyId?.designation && (
                          <p className="mt-1 max-w-45 truncate text-xs text-muted">
                            {review.facultyId.designation}
                          </p>
                        )}
                      </td>

                      {/* Submitted By */}
                      <td className="px-6 py-4">
                        <p className="max-w-45 truncate text-sm font-medium text-foreground">
                          {review.userId?.name || "Student unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {review.userId?.universityId || "No university ID"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyle(
                            review.status,
                          )}`}
                        >
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                          {review.status}
                        </span>
                      </td>

                      {/* Submitted */}
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted">
                          <CalendarDays size={14} />
                          {formatDate(review.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isUpdating && (
                            <RefreshCw
                              size={15}
                              className="animate-spin text-primary"
                            />
                          )}

                          {review.status !== "approved" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(review._id, "approved")
                              }
                              title="Approve review"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 text-emerald-600 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Check size={16} />
                            </button>
                          )}

                          {review.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(review._id, "rejected")
                              }
                              title="Reject review"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <X size={16} />
                            </button>
                          )}

                          {review.status !== "pending" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(review._id, "pending")
                              }
                              title="Reset to pending"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-muted">
                      <MessageSquare size={23} />
                    </div>

                    <h3 className="mt-3 font-semibold text-foreground">
                      No reviews found
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      There are no reviews matching your filters.
                    </p>

                    {hasFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                      >
                        <X size={14} />
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredReviews.length === 0 ? 0 : startIndex + 1}
              {" - "}
              {Math.min(startIndex + PAGE_SIZE, filteredReviews.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {filteredReviews.length}
            </span>{" "}
            reviews
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="min-w-20 text-center text-sm font-medium text-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}