"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

export interface CreateNoteData {
  courseName: string;
  courseCode: string;
  departmentCode: string;
  resourceTitle: string;
  resourceType: "Notes";
  driveUrl: string;
}

interface CreateArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNoteData) => Promise<void>;
}

const fieldClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary";

export default function CreateArchiveModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateArchiveModalProps) {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [driveUrl, setDriveUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (
      !courseName.trim() ||
      !courseCode.trim() ||
      !departmentCode.trim() ||
      !resourceTitle.trim() ||
      !driveUrl.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const parsedUrl = new URL(driveUrl.trim());

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        setError("Please enter a valid document URL.");
        return;
      }
    } catch {
      setError("Please enter a valid document URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        courseName: courseName.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        departmentCode: departmentCode.trim().toUpperCase(),
        resourceTitle: resourceTitle.trim(),
        resourceType: "Notes",
        driveUrl: driveUrl.trim(),
      });

      setCourseName("");
      setCourseCode("");
      setDepartmentCode("");
      setResourceTitle("");
      setDriveUrl("");

      onClose();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-note-title"
        className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2
              id="create-note-title"
              className="text-lg font-bold text-foreground"
            >
              Upload Notes
            </h2>

            <p className="mt-1 text-sm text-muted">
              Add your course notes to the university archive.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="resource-title"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Note Title
            </label>

            <input
              id="resource-title"
              type="text"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              placeholder="e.g. Introduction to Algorithms"
              className={fieldClass}
              maxLength={150}
            />
          </div>

          <div>
            <label
              htmlFor="course-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Course Name
            </label>

            <input
              id="course-name"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. Algorithm"
              className={fieldClass}
              maxLength={100}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="course-code"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Course Code
              </label>

              <input
                id="course-code"
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CSE-200"
                className={fieldClass}
                maxLength={30}
              />
            </div>

            <div>
              <label
                htmlFor="department-code"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Department Code
              </label>

              <input
                id="department-code"
                type="text"
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                placeholder="e.g. CSE"
                className={fieldClass}
                maxLength={20}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="drive-url"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Google Drive / Document URL
            </label>

            <input
              id="drive-url"
              type="url"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://docs.google.com/..."
              className={fieldClass}
            />

            <p className="mt-1.5 text-xs text-muted">
              Make sure your document sharing permission allows others to view
              it.
            </p>
          </div>

          {/* Resource Type */}
          <div className="rounded-lg bg-surface-secondary px-4 py-3">
            <p className="text-xs text-muted">Resource Type</p>
            <p className="mt-1 text-sm font-semibold text-foreground">Notes</p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {isSubmitting ? "Uploading..." : "Upload Notes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
