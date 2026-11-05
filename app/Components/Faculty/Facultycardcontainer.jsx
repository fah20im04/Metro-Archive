"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Users,
  SearchX,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Building2,
  BookOpen,
} from "lucide-react";

import { DEPARTMENTS } from "./temp.js";

const ITEMS_PER_PAGE = 9;

const EMPTY_FILTERS = {
  q: "",
  departmentId: "",
  designation: "",
};

export default function FacultyCardContainer({
  faculty = [],
  filters = EMPTY_FILTERS,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter faculty members.
  const filteredFaculty = useMemo(() => {
    const query = (filters.q || "").trim().toLowerCase();

    return faculty.filter((member) => {
      const name = (member.name || "").toLowerCase();
      const designation = (member.designation || "").toLowerCase();

      const matchesSearch =
        !query || name.includes(query) || designation.includes(query);

      const matchesDepartment =
        !filters.departmentId ||
        member.departmentIds?.some(
          (id) => String(id) === String(filters.departmentId),
        );

      const matchesDesignation =
        !filters.designation ||
        member.designation?.startsWith(filters.designation);

      return matchesSearch && matchesDepartment && matchesDesignation;
    });
  }, [faculty, filters]);

  // Reset pagination when filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.q, filters.departmentId, filters.designation]);

  const totalPages = Math.ceil(filteredFaculty.length / ITEMS_PER_PAGE);

  // Keep the current page valid when the results change.
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedFaculty = filteredFaculty.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">
            <GraduationCap size={15} />
            Academic Community
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Our Faculty Members
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Get to know the dedicated educators and academic professionals who
            contribute to our university community.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
            <Users size={19} />
          </div>

          <div>
            <p className="text-lg font-bold leading-tight text-foreground">
              {filteredFaculty.length}
            </p>
            <p className="text-xs text-muted">Faculty members</p>
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      {paginatedFaculty.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedFaculty.map((member) => {
              const departments = DEPARTMENTS.filter((department) =>
                member.departmentIds?.some(
                  (id) => String(id) === String(department._id),
                ),
              );

              return (
                <article
                  key={member.id || member._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  {/* Profile Header */}
                  <div className="relative flex flex-col items-center border-b border-border bg-surface-secondary/50 px-5 pb-5 pt-7 text-center">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary-light shadow-sm">
                      {member.profileImage ? (
                        <img
                          src={member.profileImage}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <GraduationCap size={38} className="text-primary" />
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {member.name}
                    </h3>

                    <span className="mt-2 inline-flex items-center rounded-full border border-primary/15 bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                      {member.designation || "Faculty Member"}
                    </span>
                  </div>

                  {/* Profile Details */}
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                        <Building2 size={14} />
                        Department
                      </div>

                      {departments.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {departments.map((department) => (
                            <span
                              key={department._id}
                              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground"
                            >
                              {department.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted">
                          Department information unavailable
                        </p>
                      )}
                    </div>

                    <div className="mt-auto border-t border-border pt-3">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span className="flex items-center gap-1.5">
                          <BookOpen size={14} />
                          Courses
                        </span>

                        <span className="font-semibold text-foreground">
                          {member.courseIds?.length}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen size={14} />
                          Vote
                        </span>

                        <span className="font-semibold text-foreground">
                          {member.upvoteCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
              <p className="text-sm text-muted">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {(safePage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredFaculty.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {filteredFaculty.length}
                </span>{" "}
                faculty members
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - safePage) <= 1,
                    )
                    .map((page, index, pages) => (
                      <span key={page} className="contents">
                        {index > 0 && pages[index - 1] !== page - 1 && (
                          <span className="px-1 text-muted">...</span>
                        )}

                        <button
                          type="button"
                          onClick={() => goToPage(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={safePage === page ? "page" : undefined}
                          className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                            safePage === page
                              ? "bg-primary text-white"
                              : "border border-border text-foreground hover:bg-surface-secondary"
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* Single-page result count */}
          {totalPages <= 1 && filteredFaculty.length > 0 && (
            <p className="mt-6 text-center text-xs text-muted">
              Showing all {filteredFaculty.length} faculty members
            </p>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-5 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <SearchX size={26} />
          </div>

          <h3 className="text-lg font-semibold text-foreground">
            No faculty members found
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            We couldn't find any faculty members matching your search. Try
            adjusting your search terms or filters.
          </p>
        </div>
      )}
    </section>
  );
}
