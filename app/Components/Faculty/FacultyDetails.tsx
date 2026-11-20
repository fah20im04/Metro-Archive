"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  GraduationCap,
  Loader2,
  PenLine,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { voteFacultyAction } from "@/actions/faculty";
import { DEPARTMENTS } from "@/app/data/department";
import { createFacultyReviewAction } from "@/actions/facultyReview";
import ReviewModal from "./ReviewModal";
import Review from "./Review";

interface Faculty {
  _id: string;
  sourceId: number;
  name: string;
  designation: string;
  departmentIds: number[];
  courseIds: number[];
  profileImage?: string | null;
  profileStatus: "pending" | "active" | "inactive";
  upvoteCount: number;
}

interface FacultyDetailsProps {
  faculty: Faculty;
  hasLiked: boolean;
  isLoggedIn: boolean;
}

export default function FacultyDetails({
  faculty,
  hasLiked: initialHasLiked,
  isLoggedIn,
}: FacultyDetailsProps) {
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likeCount, setLikeCount] = useState(faculty.upvoteCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const [message, setMessage] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Find faculty departments
  const facultyDepartments = DEPARTMENTS.filter((department) =>
    faculty.departmentIds?.some((id) => Number(id) === Number(department._id)),
  );

  async function handleLike() {
    if (!isLoggedIn) {
      toast.error("Please login to like this faculty member.");
      return;
    }

    if (hasLiked || isLiking) return;

    setIsLiking(true);
    setMessage("");

    try {
      const result = await voteFacultyAction(faculty._id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setHasLiked(true);
      setLikeCount(result.upvoteCount);

      toast.success("Thank you for your like!", {
        description: "Your appreciation has been recorded.",
      });
    } catch (error) {
      console.error("Faculty like error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLiking(false);
    }
  }

  function handleWriteReview() {
    if (!isLoggedIn) {
      setMessage("Please login to write a review.");
      return;
    }

    setMessage("");
    setIsReviewOpen(true);
  }

  async function handleSubmitReview(data: {
    title: string;
    description: string;
  }) {
    try {
      const result = await createFacultyReviewAction({
        facultyId: faculty._id,
        title: data.title,
        description: data.description,
      });

      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }

      toast.success("Review submitted successfully!", {
        description: "Your review is waiting for admin approval.",
      });
    } catch (error) {
      if (error instanceof Error) {
        // The error toast is already shown for backend errors.
        // Show a fallback only for unexpected errors.
        if (!error.message) {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      throw error;
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/faculty"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Faculty
        </Link>

        {/* Faculty profile */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Profile image */}
            {faculty.profileImage ? (
              <img
                src={faculty.profileImage}
                alt={faculty.name}
                className="h-28 w-28 shrink-0 rounded-xl border border-border object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <UserRound className="h-14 w-14 text-primary" />
              </div>
            )}

            {/* Faculty information */}
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-medium text-primary">
                Faculty Profile
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {faculty.name}
              </h1>

              <p className="mt-2 text-base text-muted-foreground">
                {faculty.designation}
              </p>

              {/* Departments */}
              <div className="mt-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Departments
                </div>

                {facultyDepartments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {facultyDepartments.map((department) => (
                      <span
                        key={department._id}
                        className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground"
                      >
                        {department.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No department information available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Like section */}
          <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-foreground">
                Support this faculty member
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Show your appreciation by liking this profile.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleLike}
                disabled={hasLiked || isLiking}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors ${
                  hasLiked
                    ? "cursor-default border border-primary/30 bg-primary/10 text-primary"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                } disabled:opacity-80`}
              >
                {isLiking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`}
                  />
                )}

                {isLiking ? "Liking..." : hasLiked ? "Liked" : "Like Faculty"}
              </button>

              <button
                type="button"
                onClick={handleWriteReview}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-secondary"
              >
                <PenLine className="h-4 w-4" />
                Write a Review
              </button>
            </div>
          </div>
          <Review facultyId={faculty._id} />

          {/* Like count */}
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-primary" />
            <span>
              <strong className="text-foreground">{likeCount}</strong>{" "}
              {likeCount === 1 ? "like" : "likes"}
            </span>
          </div>

          {/* Feedback message */}
          {message && (
            <p role="status" className="mt-3 text-sm text-muted-foreground">
              {message}
            </p>
          )}
        </div>
      </section>

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </main>
  );
}
