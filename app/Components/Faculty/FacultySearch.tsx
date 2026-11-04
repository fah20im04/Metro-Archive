"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface Department {
  _id: string;
  name: string;
}

interface FacultyFilters {
  q: string;
  departmentId: string;
  designation: string;
}

interface FacultySearchProps {
  departments?: Department[];
  onChange?: (filters: FacultyFilters) => void;
}

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Teaching Assistant",
];

const DEBOUNCE_MS = 300;

const selectClass =
  "w-full cursor-pointer rounded-xl border-0 bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus-visible:outline-none md:w-auto";

export default function FacultySearch({
  departments = [],
  onChange,
}: FacultySearchProps) {
  const [q, setQ] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [designation, setDesignation] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  // Keep the latest callback without retriggering effects.
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Debounce the search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [q]);

  // Emit filters whenever they change.
  useEffect(() => {
    onChangeRef.current?.({
      q: debouncedQ,
      departmentId,
      designation,
    });
  }, [debouncedQ, departmentId, designation]);

  const hasFilters = Boolean(q || departmentId || designation);

  const clear = () => {
    setQ("");
    setDebouncedQ("");
    setDepartmentId("");
    setDesignation("");
  };

  return (
    <section className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Component Heading */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Faculty Directory
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Find faculty members by name, department, or designation.
          </p>
        </div>

        {/* Search Bar */}
        <div
          role="search"
          className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-lg shadow-black/5 transition-colors duration-200 md:flex-row md:items-center md:gap-3"
        >
          {/* Name */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Search className="ml-2 shrink-0 text-muted-foreground" size={21} />

            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search faculty by name..."
              aria-label="Search faculty by name"
              className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none"
            />
          </div>

          <div className="hidden h-6 w-px bg-border md:block" />

          {/* Department */}
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            aria-label="Filter by department"
            className={selectClass}
          >
            <option value="">All departments</option>

            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>

          <div className="hidden h-6 w-px bg-border md:block" />

          {/* Designation */}
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            aria-label="Filter by designation"
            className={selectClass}
          >
            <option value="">All designations</option>

            {DESIGNATIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
