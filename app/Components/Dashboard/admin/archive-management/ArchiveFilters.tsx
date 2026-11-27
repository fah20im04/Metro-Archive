"use client";

import { Filter, Search, X } from "lucide-react";
import { RESOURCE_TYPES, EXAM_TYPES, type TabType } from "./types";

interface Props {
  activeTab: TabType;
  search: string;
  setSearch: (value: string) => void;

  resourceType: string;
  setResourceType: (value: string) => void;

  departmentCode: string;
  setDepartmentCode: (value: string) => void;

  departmentName: string;
  setDepartmentName: (value: string) => void;

  semester: string;
  setSemester: (value: string) => void;

  batch: string;
  setBatch: (value: string) => void;

  examType: string;
  setExamType: (value: string) => void;

  section: string;
  setSection: (value: string) => void;

  onClear: () => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-muted-foreground";

export default function ArchiveFilters({
  activeTab,
  search,
  setSearch,
  resourceType,
  setResourceType,
  departmentCode,
  setDepartmentCode,
  departmentName,
  setDepartmentName,
  semester,
  setSemester,
  batch,
  setBatch,
  examType,
  setExamType,
  section,
  setSection,
  onClear,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={17} className="text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Search and filters
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative sm:col-span-2 lg:col-span-3">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "resources"
                ? "Search by title, course, or department..."
                : "Search by title, course, batch, or exam type..."
            }
            className={`${inputClass} pl-10`}
          />
        </div>

        {activeTab === "resources" ? (
          <>
            <div>
              <label className={labelClass}>Resource type</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className={inputClass}
              >
                <option value="">All resource types</option>
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Department code</label>
              <input
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                placeholder="e.g. CSE"
                className={inputClass}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={labelClass}>Department</label>
              <input
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Department name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Semester</label>
              <input
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. 3.2"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Batch</label>
              <input
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="Batch"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Exam type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className={inputClass}
              >
                <option value="">All exam types</option>
                {EXAM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Section</label>
              <input
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="Section"
                className={inputClass}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition hover:text-primary"
        >
          <X size={14} />
          Clear all filters
        </button>
      </div>
    </div>
  );
}
