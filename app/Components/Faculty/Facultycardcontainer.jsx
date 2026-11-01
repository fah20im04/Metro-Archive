"use client";

import { useMemo, useState } from "react";
// import FacultyCard from "./FacultyCard";
import { FACULTY_LIST, DEPARTMENTS } from "./temp.js";

import FacultyCard from "./FacultyCard";

const EMPTY_FILTERS = { q: "", departmentId: "", designation: "" };

/**
 * Props:
 *  - filters: { q, departmentId, designation } from <FacultySearch onChange />
 *    (optional; no filters = show everyone)
 *
 * Dev-only: reads from the static FACULTY_LIST and keeps upvotes in local
 * state. Swap FACULTY_LIST for fetched data when the API is ready.
 */
export default function FacultyCardContainer({ filters = EMPTY_FILTERS }) {
    // ids of faculty the "current user" has upvoted (local only, resets on refresh)
    const [upvotedIds, setUpvotedIds] = useState(() => new Set());

    const toggleUpvote = (id) => {
        setUpvotedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const visible = useMemo(() => {
        const q = (filters.q || "").toLowerCase();
        return FACULTY_LIST.filter((f) => {
            if (q && !f.name.toLowerCase().includes(q)) return false;
            if (
                filters.departmentId &&
                !f.departmentIds.some((id) => String(id) === String(filters.departmentId))
            )
                return false;
            // startsWith so "Lecturer" also matches "Lecturer (Study Leave)"
            // while "Professor" still excludes "Associate/Assistant Professor"
            if (filters.designation && !f.designation.startsWith(filters.designation))
                return false;
            return true;
        });
    }, [filters]);

    if (visible.length === 0) {
        return (
            <p className="py-12 text-center text-sm text-muted-foreground">
                No faculty found. Try changing your search or filters.
            </p>
        );
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-6">
            <p className="mb-4 text-sm text-muted-foreground">
                {visible.length} faculty member{visible.length === 1 ? "" : "s"}
            </p>

            <div className="flex flex-col gap-4">
                {visible.map((f) => {
                    const upvoted = upvotedIds.has(f._id);
                    return (
                        <FacultyCard
                            key={f._id}
                            faculty={{
                                ...f,
                                departments: DEPARTMENTS.filter((d) =>
                                    f.departmentIds.includes(d._id)
                                ),
                                upvoteCount: upvoted ? 1 : 0, // placeholder until votes come from the API
                            }}
                            upvoted={upvoted}
                            onUpvote={toggleUpvote}
                        />
                    );
                })}
            </div>
        </section>
    );
}