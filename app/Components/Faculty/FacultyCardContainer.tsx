"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
} from "lucide-react";

import { DEPARTMENTS } from "@/app/data/department";

interface FacultyMember {
  _id: string;
  name: string;
  designation: string;
  profileImage?: string | null;
  departmentIds?: number[];
  upvoteCount?: number;
}

interface FacultyCardContainerProps {
  faculty: FacultyMember[];
}

type SortOption = "default" | "most-liked" | "least-liked";

const ITEMS_PER_PAGE = 9;

export default function FacultyCardContainer({
  faculty,
}: FacultyCardContainerProps) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [designation, setDesignation] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique designations
  const designations = useMemo(
    () =>
      Array.from(
        new Set(faculty.map((member) => member.designation).filter(Boolean)),
      ).sort(),
    [faculty],
  );

  // Filter and sort faculty members
  const filteredFaculty = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = faculty.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.designation.toLowerCase().includes(query);

      const matchesDepartment =
        department === "all" ||
        member.departmentIds?.some((id) => String(id) === department);

      const matchesDesignation =
        designation === "all" || member.designation === designation;

      return matchesSearch && matchesDepartment && matchesDesignation;
    });

    if (sortBy === "most-liked") {
      return [...filtered].sort(
        (a, b) => (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0),
      );
    }

    if (sortBy === "least-liked") {
      return [...filtered].sort(
        (a, b) => (a.upvoteCount ?? 0) - (b.upvoteCount ?? 0),
      );
    }

    return filtered;
  }, [faculty, search, department, designation, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredFaculty.length / ITEMS_PER_PAGE);

  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const visibleFaculty = filteredFaculty.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  // Clear all filters
  function clearFilters() {
    setSearch("");
    setDepartment("all");
    setDesignation("all");
    setSortBy("default");
    setCurrentPage(1);
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-7 rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Find Faculty</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name or designation..."
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Department filter */}
          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="all">All departments</option>

            {DEPARTMENTS.map((item) => (
              <option key={item._id} value={String(item._id)}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Designation filter */}
          <select
            value={designation}
            onChange={(event) => {
              setDesignation(event.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="all">All designations</option>

            {designations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Sort by likes */}
          <select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value as SortOption);
              setCurrentPage(1);
            }}
            aria-label="Sort by like count"
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="default">Sort: Default</option>
            <option value="most-liked">Likes: Most to Least</option>
            <option value="least-liked">Likes: Least to Most</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredFaculty.length} faculty members found
          </p>

          {(search ||
            department !== "all" ||
            designation !== "all" ||
            sortBy !== "default") && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Faculty cards */}
      {filteredFaculty.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-semibold">
            No faculty members found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFaculty.map((member) => (
              <article
                key={member._id}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 font-semibold text-foreground">
                      {member.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {member.designation}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    {member.upvoteCount ?? 0} Like
                  </div>

                  <Link
                    href={`/faculty/${member._id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80"
                  >
                    View Profile
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage(safePage - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm ${
                      safePage === page
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
