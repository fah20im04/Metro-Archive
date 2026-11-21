"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  FolderOpen,
  Users,
  FileText,
  Plus,
  ArrowUpRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";

import { createArchiveAction } from "@/actions/archive";
import { buildArchiveTitle, semesterLabel } from "@/lib/archive";
import CreateArchiveModal, { type CreateArchiveData } from "./CreateArchiveModal";

export interface ArchiveItem {
  id: string;
  title: string;
  semester: string;
  department: string;
  batch: string;
  description: string;
  createdByName: string;
  resourceCount: number;
}

interface ArchiveProps {
  archives: ArchiveItem[];
  stats: {
    totalArchives: number;
    contributors: number;
    resources: number;
  };
  isLoggedIn: boolean;
}

const Archive = ({ archives, stats, isLoggedIn }: ArchiveProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filters = ["All", "CSE", "BBA", "EEE", "Other"];

  const filteredArchives = archives.filter((archive) => {
    const query = search.toLowerCase();

    const matchesSearch =
      archive.title.toLowerCase().includes(query) ||
      archive.department.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Other"
        ? !["CSE", "BBA", "EEE"].includes(archive.department)
        : archive.department === activeFilter);

    return matchesSearch && matchesFilter;
  });

  function handleCreateClick() {
    if (!isLoggedIn) {
      toast.error("Please login to create an archive.");
      return;
    }

    setIsCreateOpen(true);
  }

  async function handleCreateArchive(data: CreateArchiveData) {
    const result = await createArchiveAction(data);

    if (!result.success) {
      // The modal shows this message and stays open
      throw new Error(result.message);
    }

    toast.success(result.message);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <FolderOpen size={17} />
              CAMPUSVAULT / ARCHIVES
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Academic Archives
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Explore your university&apos;s academic collections. Find notes,
              assignments, lab reports and previous questions shared by students
              from your batch.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateClick}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            <Plus size={18} />
            Create Archive
          </button>
        </div>

        {/* Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card rounded-xl p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <FolderOpen size={20} />
            </div>
            <p className="text-sm text-muted">Total Archives</p>
            <h2 className="mt-1 text-2xl font-bold">
              {stats.totalArchives.toLocaleString()}
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
              <FileText size={20} />
            </div>
            <p className="text-sm text-muted">Shared Resources</p>
            <h2 className="mt-1 text-2xl font-bold">
              {stats.resources.toLocaleString()}
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
              placeholder="Search by batch, department or archive name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeFilter === filter
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
                  }`}
              >
                {filter}
              </button>
            ))}

            <span className="ml-auto text-xs text-muted">
              {filteredArchives.length} archives found
            </span>
          </div>
        </div>

        {/* Archive List */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Browse Archives</h2>
          <span className="text-sm text-muted">Recently updated</span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredArchives.map((archive) => (
            <div
              key={archive.id}
              className="card group flex flex-col rounded-xl p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              {/* Card Header */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <GraduationCap size={25} />
                </div>

                <span className="rounded-lg bg-surface-secondary px-3 py-1.5 text-xs font-medium text-muted">
                  {archive.department}
                </span>
              </div>

              {/* Details */}
              <h3 className="text-lg font-bold tracking-tight">
                {archive.title}
              </h3>

              <p className="mt-1 text-xs font-medium text-primary">
                {semesterLabel(archive.semester)} · Batch {archive.batch}
              </p>

              <p className="mt-3 min-h-10 text-sm leading-5 text-muted">
                {archive.description ||
                  `Resources shared by students of ${buildArchiveTitle(
                    archive.semester,
                    archive.department,
                    archive.batch
                  )}.`}
              </p>

              <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Users size={15} />
                  By {archive.createdByName}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <BookOpen size={15} />
                  {archive.resourceCount} Resources
                </div>
              </div>

              {/* Footer */}
              <button className="mt-5 flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                Explore Archive
                <ArrowUpRight size={17} />
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArchives.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <FolderOpen size={35} className="mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No archives found</h3>
            <p className="mt-2 text-sm text-muted">
              {archives.length === 0
                ? "No archive has been created yet. Be the first to create one."
                : "Try another search or select a different department."}
            </p>
          </div>
        )}
      </div>

      <CreateArchiveModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateArchive}
      />
    </main>
  );
};

export default Archive;
