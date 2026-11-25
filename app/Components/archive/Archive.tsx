"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Search, FolderOpen, Users, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";

import {
  toggleResourceLikeAction,
  getResourceLikeStatusAction,
} from "@/actions/resource";

import {
  toggleBookmarkAction,
  getBookmarkStatusesAction,
} from "@/actions/bookmark";

import ArchiveCard, {
  type ResourceItem,
} from "@/app/Components/Reusable/ArchiveCard";

interface ArchiveProps {
  resources: ResourceItem[];
  isLoggedIn: boolean;
}

interface LikeState {
  hasLiked: boolean;
  likeCount: number;
}

interface BookmarkState {
  hasBookmarked: boolean;
  bookmarkCount: number;
}

const Archive = ({ resources, isLoggedIn }: ArchiveProps) => {
  const [likeStates, setLikeStates] = useState<Record<string, LikeState>>({});
  const [likingResources, setLikingResources] = useState<string[]>([]);

  const [bookmarkStates, setBookmarkStates] = useState<
    Record<string, BookmarkState>
  >({});
  const [bookmarkingResources, setBookmarkingResources] = useState<string[]>(
    [],
  );

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "CSE", "BBA", "EEE", "Other"];

  // Initialize like counts
  useEffect(() => {
    const initialStates: Record<string, LikeState> = {};

    resources.forEach((resource) => {
      initialStates[resource._id] = {
        hasLiked: false,
        likeCount: resource.likeCount ?? 0,
      };
    });

    setLikeStates(initialStates);
  }, [resources]);

  // Fetch current user's like status
  useEffect(() => {
    if (!isLoggedIn || resources.length === 0) return;

    let cancelled = false;

    const fetchLikeStatuses = async () => {
      try {
        const results = await Promise.all(
          resources.map(async (resource) => {
            const result = await getResourceLikeStatusAction(resource._id);

            return {
              id: resource._id,
              hasLiked: result.success ? result.hasLiked : false,
            };
          }),
        );

        if (cancelled) return;

        setLikeStates((prev) => {
          const updated = { ...prev };

          results.forEach(({ id, hasLiked }) => {
            updated[id] = {
              hasLiked,
              likeCount:
                updated[id]?.likeCount ??
                resources.find((resource) => resource._id === id)?.likeCount ??
                0,
            };
          });

          return updated;
        });
      } catch (error) {
        console.error("Fetch like statuses error:", error);
      }
    };

    fetchLikeStatuses();

    return () => {
      cancelled = true;
    };
  }, [resources, isLoggedIn]);

  // Initialize bookmark counts and statuses
  useEffect(() => {
    const initialStates: Record<string, BookmarkState> = {};

    resources.forEach((resource) => {
      initialStates[resource._id] = {
        hasBookmarked: false,
        bookmarkCount: 0,
      };
    });

    setBookmarkStates(initialStates);
  }, [resources]);

  // Fetch bookmark statuses in one batch
  useEffect(() => {
    if (!isLoggedIn || resources.length === 0) return;

    let cancelled = false;

    const fetchBookmarkStatuses = async () => {
      try {
        const result = await getBookmarkStatusesAction(
          resources.map((resource) => resource._id),
          "Resource",
        );

        if (cancelled || !result.success) return;

        setBookmarkStates((prev) => {
          const updated = { ...prev };

          Object.entries(result.statuses).forEach(([id, status]) => {
            updated[id] = {
              hasBookmarked: status.hasBookmarked,
              bookmarkCount: status.bookmarkCount,
            };
          });

          return updated;
        });
      } catch (error) {
        console.error("Fetch bookmark statuses error:", error);
      }
    };

    fetchBookmarkStatuses();

    return () => {
      cancelled = true;
    };
  }, [resources, isLoggedIn]);

  // Handle like and unlike
  const handleLike = async (resourceId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to like resources.");
      return;
    }

    if (likingResources.includes(resourceId)) return;

    setLikingResources((prev) => [...prev, resourceId]);

    try {
      const result = await toggleResourceLikeAction(resourceId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setLikeStates((prev) => ({
        ...prev,
        [resourceId]: {
          hasLiked: result.hasLiked,
          likeCount: result.likeCount,
        },
      }));

      toast.success(result.message);
    } catch (error) {
      console.error("Toggle like error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLikingResources((prev) => prev.filter((id) => id !== resourceId));
    }
  };

  // Handle bookmark and remove bookmark
  const handleBookmark = async (resourceId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to bookmark resources.");
      return;
    }

    if (bookmarkingResources.includes(resourceId)) return;

    setBookmarkingResources((prev) => [...prev, resourceId]);

    try {
      const result = await toggleBookmarkAction(resourceId, "Resource");

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setBookmarkStates((prev) => ({
        ...prev,
        [resourceId]: {
          hasBookmarked: result.hasBookmarked ?? false,
          bookmarkCount: result.bookmarkCount ?? 0,
        },
      }));

      toast.success(result.message);
    } catch (error) {
      console.error("Toggle bookmark error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBookmarkingResources((prev) => prev.filter((id) => id !== resourceId));
    }
  };

  // Calculate overview statistics
  const stats = useMemo(() => {
    const contributors = new Set(
      resources
        .map(
          (resource) =>
            resource.uploadedBy?._id || resource.uploadedBy?.universityId,
        )
        .filter(Boolean),
    );

    const courses = new Set(
      resources.map((resource) => resource.courseCode).filter(Boolean),
    );

    return {
      totalResources: resources.length,
      contributors: contributors.size,
      courses: courses.size,
    };
  }, [resources]);

  // Search and department filtering
  const filteredResources = resources.filter((resource) => {
    const query = search.toLowerCase();

    const matchesSearch =
      resource.resourceTitle?.toLowerCase().includes(query) ||
      resource.courseName?.toLowerCase().includes(query) ||
      resource.courseCode?.toLowerCase().includes(query) ||
      resource.departmentCode?.toLowerCase().includes(query) ||
      resource.resourceType?.toLowerCase().includes(query);

    const department = resource.departmentCode?.toUpperCase() || "";

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Other"
        ? !["CSE", "BBA", "EEE"].includes(department)
        : department === activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <FolderOpen size={17} />
            MUArchive / ARCHIVES
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Academic Archives
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Explore academic resources shared by students. Find notes,
            assignments, lab reports and previous questions from different
            courses and departments.
          </p>
        </div>

        {/* Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card rounded-xl p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <FileText size={20} />
            </div>

            <p className="text-sm text-muted">Total Resources</p>
            <h2 className="mt-1 text-2xl font-bold">
              {stats.totalResources.toLocaleString()}
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
              placeholder="Search by resource, course or department..."
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
              {filteredResources.length} resources found
            </span>
          </div>
        </div>

        {/* Resource List */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Browse Resources</h2>
          <span className="text-sm text-muted">Recently uploaded</span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => {
            const likeState = likeStates[resource._id];
            const bookmarkState = bookmarkStates[resource._id];

            return (
              <ArchiveCard
                key={resource._id}
                resource={resource}
                hasLiked={likeState?.hasLiked ?? false}
                likeCount={likeState?.likeCount ?? resource.likeCount ?? 0}
                isLiking={likingResources.includes(resource._id)}
                onLike={handleLike}
                isBookmarked={bookmarkState?.hasBookmarked ?? false}
                bookmarkCount={bookmarkState?.bookmarkCount ?? 0}
                isBookmarking={bookmarkingResources.includes(resource._id)}
                onBookmark={handleBookmark}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <FolderOpen size={35} className="mx-auto text-muted-foreground" />

            <h3 className="mt-4 font-semibold">No resources found</h3>

            <p className="mt-2 text-sm text-muted">
              {resources.length === 0
                ? "No resources have been uploaded yet."
                : "Try another search or select a different department."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Archive;
