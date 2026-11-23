"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  FileQuestion,
  Users,
  FileText,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface QuestionPaper {
  _id: string;
  title: string;
  courseName: string;
  departmentName: string;
  semester: string;
  batch: string;
  section?: string;
  examType: "Midterm" | "Final" | "Quiz" | "Other";
  driveUrl: string;
  uploadedBy?: {
    _id: string;
    name: string;
    universityId: string;
  } | null;
  createdAt?: string;
}

interface QuestionBankProps {
  isLoggedIn: boolean;
}

const QuestionBank = ({ isLoggedIn }: QuestionBankProps) => {
  const [questions, setQuestions] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "CSE", "BBA", "EEE", "Other"];

  // Fetch question papers from the API
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchQuestionPapers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/question-bank", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch question papers.");
        }

        setQuestions(result.questionPapers || []);
      } catch (error) {
        console.error("Fetch Question Papers Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading question papers.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionPapers();
  }, [isLoggedIn]);

  // Overview statistics
  const stats = useMemo(() => {
    const contributors = new Set(
      questions.map((question) => question.uploadedBy?._id).filter(Boolean),
    );

    const courses = new Set(
      questions.map((question) => question.courseName).filter(Boolean),
    );

    return {
      totalQuestions: questions.length,
      contributors: contributors.size,
      courses: courses.size,
    };
  }, [questions]);

  // Department filter helper
  const matchesDepartment = (departmentName: string, filter: string) => {
    const department = departmentName.toLowerCase();

    if (filter === "All") return true;

    if (filter === "CSE") {
      return (
        department.includes("cse") || department.includes("computer science")
      );
    }

    if (filter === "BBA") {
      return (
        department.includes("bba") ||
        department.includes("business administration")
      );
    }

    if (filter === "EEE") {
      return department.includes("eee") || department.includes("electrical");
    }

    return !(
      department.includes("cse") ||
      department.includes("computer science") ||
      department.includes("bba") ||
      department.includes("business administration") ||
      department.includes("eee") ||
      department.includes("electrical")
    );
  };

  // Search and department filtering
  const filteredQuestions = questions.filter((question) => {
    const query = search.toLowerCase();

    const matchesSearch =
      question.title?.toLowerCase().includes(query) ||
      question.courseName?.toLowerCase().includes(query) ||
      question.departmentName?.toLowerCase().includes(query) ||
      question.batch?.toLowerCase().includes(query) ||
      question.semester?.toLowerCase().includes(query) ||
      question.examType?.toLowerCase().includes(query);

    const matchesFilter = matchesDepartment(
      question.departmentName || "",
      activeFilter,
    );

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <FileQuestion size={17} />
            MUArchive / QUESTION BANK
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Question Bank
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Practice with previous question papers shared by students. Find
            midterm and final questions from different courses and departments.
          </p>
        </div>

        {/* Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card rounded-xl p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <FileText size={20} />
            </div>

            <p className="text-sm text-muted">Question Papers</p>
            <h2 className="mt-1 text-2xl font-bold">
              {stats.totalQuestions.toLocaleString()}
            </h2>
          </div>

          <div className="card rounded-xl p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-light text-accent">
              <Users size={20} />
            </div>

            <p className="text-sm text-muted">Contributors</p>
            <h2 className="mt-1 text-2xl font-bold">
              {stats.contributors.toLocaleString()}
            </h2>
          </div>

          <div className="card rounded-xl p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-secondary text-foreground">
              <BookOpen size={20} />
            </div>

            <p className="text-sm text-muted">Courses</p>
            <h2 className="mt-1 text-2xl font-bold">
              {stats.courses.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-7">
          <div className="relative mb-5">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search by title, course or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {filter}
              </button>
            ))}

            <span className="ml-auto text-xs text-muted">
              {filteredQuestions.length} question papers found
            </span>
          </div>
        </div>

        {/* Question Paper List */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Browse Question Papers</h2>
          <span className="text-sm text-muted">Recently uploaded</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card h-64 animate-pulse rounded-xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <FileQuestion size={35} className="mx-auto text-muted-foreground" />

            <h3 className="mt-4 font-semibold">
              Unable to load question papers
            </h3>

            <p className="mt-2 text-sm text-muted">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Question Paper Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuestions.map((question) => (
              <div
                key={question._id}
                className="card group flex flex-col rounded-xl p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                {/* Card Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <GraduationCap size={25} />
                  </div>

                  <span className="rounded-lg bg-surface-secondary px-3 py-1.5 text-xs font-medium text-muted">
                    {question.departmentName || "General"}
                  </span>
                </div>

                {/* Question Paper Details */}
                <h3 className="text-lg font-bold tracking-tight">
                  {question.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-primary">
                  {question.courseName}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted">
                    {question.examType}
                  </span>

                  <span className="rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted">
                    Semester {question.semester}
                  </span>

                  <span className="rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted">
                    Batch {question.batch}
                  </span>

                  {question.examType === "Quiz" && question.section && (
                    <span className="rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted">
                      Section {question.section}
                    </span>
                  )}
                </div>

                {/* Uploader */}
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
                      <Users size={15} className="shrink-0" />
                      <span className="truncate">
                        {question.uploadedBy?.name || "Unknown contributor"}
                      </span>
                    </div>

                    <span className="pl-[21px] text-[11px] text-muted">
                      {question.uploadedBy?.universityId ||
                        "University ID unavailable"}
                    </span>
                  </div>
                </div>

                {/* Open Question Paper */}
                {question.driveUrl ? (
                  <a
                    href={question.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground! no-underline! transition group-hover:border-primary group-hover:bg-primary group-hover:text-white!"
                  >
                    View Question Paper
                    <ArrowUpRight size={17} />
                  </a>
                ) : (
                  <div className="mt-5 rounded-lg border border-border px-4 py-2.5 text-center text-sm text-muted">
                    Question paper link unavailable
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredQuestions.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <FileQuestion size={35} className="mx-auto text-muted-foreground" />

            <h3 className="mt-4 font-semibold">No question papers found</h3>

            <p className="mt-2 text-sm text-muted">
              {questions.length === 0
                ? "No question papers have been uploaded yet."
                : "Try another search or select a different department."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default QuestionBank;
