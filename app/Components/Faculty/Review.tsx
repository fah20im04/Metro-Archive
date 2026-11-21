"use client";

import { useEffect, useState } from "react";
import { MessageSquare, UserRound, CalendarDays, Loader2 } from "lucide-react";

import { getFacultyReviewsAction } from "@/actions/facultyReview";

interface FacultyReview {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    universityId: string;
  } | null;
}

interface ReviewProps {
  facultyId: string;
}

export default function Review({ facultyId }: ReviewProps) {
  const [reviews, setReviews] = useState<FacultyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        setIsLoading(true);
        setError("");

        const result = await getFacultyReviewsAction(facultyId);

        if (!isMounted) return;

        if (result.success) {
          setReviews(result.reviews as FacultyReview[]);
        } else {
          setError(result.message || "Failed to load reviews.");
        }
      } catch (error) {
        console.error("Fetch faculty reviews error:", error);

        if (isMounted) {
          setError("Something went wrong while loading reviews.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  return (
    <section className="mt-8">
      {/* Section Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageSquare className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">Student Reviews</h2>
          <p className="text-sm text-muted">Experiences shared by students</p>
        </div>

        {!isLoading && (
          <span className="ml-auto rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold text-foreground">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border py-12 text-sm text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading reviews...
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && reviews.length === 0 && (
        <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
          <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted" />

          <h3 className="font-semibold text-foreground">No reviews yet</h3>

          <p className="mt-1 text-sm text-muted">
            Be the first student to share your experience with this faculty
            member.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary/30"
            >
              {/* Reviewer Information */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {review.userId?.name || "Student"}
                  </h3>

                  <p className="text-xs text-muted">
                    {review.userId?.universityId || "University student"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-xs text-muted">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Review Content */}
              <div className="mt-4">
                <h4 className="font-semibold text-foreground">
                  {review.title}
                </h4>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                  {review.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
