"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  FileQuestion,
  Search,
  GraduationCap,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";

import { getMyBookmarksAction, toggleBookmarkAction } from "@/actions/bookmark";

import BookmarkCard from "../../Reusable/BookmarkCard";

type BookmarkType = "notes" | "question-papers";

interface ResourceItem {
  _id: string;
  resourceTitle: string;
  courseName: string;
  courseCode?: string;
  departmentCode?: string;
  resourceType?: string;
  driveUrl: string;
  createdAt?: string;
}

interface QuestionPaperItem {
  _id: string;
  title: string;
  courseName: string;
  departmentName?: string;
  semester?: string;
  batch?: string;
  examType?: string;
  driveUrl: string;
  createdAt?: string;
}

interface SavedBookmark {
  bookmarkId: string;
  itemType: "Resource" | "QuestionPaper";
  bookmarkedAt: string;
  item: ResourceItem | QuestionPaperItem;
}

export default function Bookmarks() {
  const [activeTab, setActiveTab] = useState<BookmarkType>("notes");
  const [searchQuery, setSearchQuery] = useState("");

  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  // Load the student's bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);

        const result = await getMyBookmarksAction();

        if (!result.success) {
          toast.error(result.message || "Could not load bookmarks.");
          return;
        }

        setBookmarks((result.bookmarks ?? []) as SavedBookmark[]);
      } catch (error) {
        console.error("Load bookmarks error:", error);
        toast.error("Something went wrong while loading bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Separate resources and question papers
  const noteBookmarks = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.itemType === "Resource"),
    [bookmarks],
  );

  const questionPaperBookmarks = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.itemType === "QuestionPaper"),
    [bookmarks],
  );

  // Search notes
  const filteredNotes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return noteBookmarks.filter((bookmark) => {
      const item = bookmark.item as ResourceItem;

      return `${item.resourceTitle} ${item.courseName} ${item.courseCode ?? ""} ${item.departmentCode ?? ""}`
        .toLowerCase()
        .includes(query);
    });
  }, [noteBookmarks, searchQuery]);

  // Search question papers
  const filteredPapers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return questionPaperBookmarks.filter((bookmark) => {
      const item = bookmark.item as QuestionPaperItem;

      return `${item.title} ${item.courseName} ${item.examType ?? ""} ${item.batch ?? ""} ${item.semester ?? ""}`
        .toLowerCase()
        .includes(query);
    });
  }, [questionPaperBookmarks, searchQuery]);

  const isNotes = activeTab === "notes";

  // Remove a bookmark
  const handleRemoveBookmark = async (bookmark: SavedBookmark) => {
    const itemId = bookmark.item._id;

    if (removingIds.includes(itemId)) return;

    try {
      setRemovingIds((prev) => [...prev, itemId]);

      const result = await toggleBookmarkAction(itemId, bookmark.itemType);

      if (!result.success) {
        toast.error(result.message || "Could not remove bookmark.");
        return;
      }

      if (!result.hasBookmarked) {
        setBookmarks((prev) =>
          prev.filter(
            (saved) =>
              !(
                saved.item._id === itemId &&
                saved.itemType === bookmark.itemType
              ),
          ),
        );

        toast.success("Bookmark removed.");
      }
    } catch (error) {
      console.error("Remove bookmark error:", error);
      toast.error("Something went wrong.");
    } finally {
      setRemovingIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Format bookmark date
  const formatDate = (date?: string) => {
    if (!date) return "Recently saved";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently saved";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-primary">YOUR COLLECTION</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Bookmarks
        </h1>

        <p className="mt-2 text-sm text-muted">
          Keep your important notes and question papers in one place.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 rounded-xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen size={22} />
          </div>

          <div>
            <p className="text-sm text-muted">Saved Notes</p>
            <h2 className="mt-1 text-2xl font-bold">{noteBookmarks.length}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4 rounded-xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileQuestion size={22} />
          </div>

          <div>
            <p className="text-sm text-muted">Saved Question Papers</p>
            <h2 className="mt-1 text-2xl font-bold">
              {questionPaperBookmarks.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="card rounded-xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Toggle */}
          <div className="flex w-full rounded-xl bg-surface-secondary p-1 sm:w-fit">
            <button
              type="button"
              onClick={() => {
                setActiveTab("notes");
                setSearchQuery("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
                isNotes
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <BookOpen size={17} />
              Notes
              <span className="text-xs opacity-80">
                ({noteBookmarks.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("question-papers");
                setSearchQuery("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
                !isNotes
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <FileQuestion size={17} />
              Question Papers
              <span className="text-xs opacity-80">
                ({questionPaperBookmarks.length})
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${isNotes ? "notes" : "question papers"}...`}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Bookmark List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isNotes ? "Your Saved Notes" : "Your Saved Question Papers"}
          </h2>

          <span className="text-sm text-muted">
            {isNotes ? filteredNotes.length : filteredPapers.length} items
          </span>
        </div>

        {loading ? (
          <div className="card flex items-center justify-center rounded-xl py-16">
            <div className="flex items-center gap-3 text-sm text-muted">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading your bookmarks...
            </div>
          </div>
        ) : isNotes ? (
          filteredNotes.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredNotes.map((bookmark) => {
                const note = bookmark.item as ResourceItem;

                return (
                  <BookmarkCard
                    key={bookmark.bookmarkId}
                    title={note.resourceTitle}
                    courseName={note.courseName}
                    subtitle={
                      note.courseCode
                        ? `${note.courseCode}${note.departmentCode ? ` · ${note.departmentCode}` : ""}`
                        : note.departmentCode
                    }
                    type="notes"
                    badges={[
                      note.resourceType || "Notes",
                      ...(note.courseCode ? [note.courseCode] : []),
                    ]}
                    driveUrl={note.driveUrl}
                    bookmarkedAt={formatDate(bookmark.bookmarkedAt)}
                    isRemoving={removingIds.includes(note._id)}
                    onRemove={() => handleRemoveBookmark(bookmark)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState type="notes" />
          )
        ) : filteredPapers.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredPapers.map((bookmark) => {
              const paper = bookmark.item as QuestionPaperItem;

              return (
                <BookmarkCard
                  key={bookmark.bookmarkId}
                  title={paper.title}
                  courseName={paper.courseName}
                  subtitle={paper.departmentName}
                  type="question-papers"
                  badges={[
                    ...(paper.examType ? [paper.examType] : []),
                    ...(paper.semester ? [`Semester ${paper.semester}`] : []),
                    ...(paper.batch ? [`Batch ${paper.batch}`] : []),
                  ]}
                  driveUrl={paper.driveUrl}
                  bookmarkedAt={formatDate(bookmark.bookmarkedAt)}
                  isRemoving={removingIds.includes(paper._id)}
                  onRemove={() => handleRemoveBookmark(bookmark)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState type="question-papers" />
        )}
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: BookmarkType }) {
  const isNotes = type === "notes";

  return (
    <div className="card flex flex-col items-center justify-center rounded-xl px-5 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
        {isNotes ? <FolderOpen size={29} /> : <GraduationCap size={29} />}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {isNotes ? "No notes found" : "No question papers found"}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted">
        {isNotes
          ? "You haven't bookmarked any notes yet. Browse your archive and save useful study materials."
          : "You haven't bookmarked any question papers yet. Explore the question bank and save papers for later."}
      </p>

      <Link
        href={isNotes ? "/archives" : "/question-bank"}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold !text-white transition hover:opacity-90"
      >
        {isNotes ? "Explore Archives" : "Explore Question Bank"}
      </Link>
    </div>
  );
}
