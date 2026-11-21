"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import {
  ARCHIVE_DEPARTMENTS,
  SEMESTERS,
  buildArchiveTitle,
  semesterLabel,
} from "@/lib/archive";

export interface CreateArchiveData {
  semester: string;
  department: string;
  batch: string;
  description: string;
}

interface CreateArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateArchiveData) => Promise<void>;
}

const fieldClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary";

export default function CreateArchiveModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateArchiveModalProps) {
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting) onClose();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const previewTitle =
    semester && department && batch.trim()
      ? buildArchiveTitle(semester, department, batch.trim())
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!semester) {
      setError("Please select a semester.");
      return;
    }

    if (!department) {
      setError("Please select a department.");
      return;
    }

    if (!/^\d{1,3}$/.test(batch.trim())) {
      setError("Batch must be a number, e.g. 60.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit({
        semester,
        department,
        batch: batch.trim(),
        description: description.trim(),
      });

      setSemester("");
      setDepartment("");
      setBatch("");
      setDescription("");
      onClose();
    } catch (err) {
      // Backend messages (e.g. "already exists") are thrown by the parent
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
        aria-labelledby="create-archive-title"
        className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              id="create-archive-title"
              className="text-lg font-bold text-foreground"
            >
              Create Archive
            </h2>
            <p className="mt-1 text-sm text-muted">
              One archive per semester, department and batch.
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="archive-semester"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Semester
            </label>
            <select
              id="archive-semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className={fieldClass}
            >
              <option value="">Select semester</option>
              {SEMESTERS.map((value) => (
                <option key={value} value={value}>
                  {value} · {semesterLabel(value)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="archive-department"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Department
              </label>
              <select
                id="archive-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={fieldClass}
              >
                <option value="">Select department</option>
                {ARCHIVE_DEPARTMENTS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="archive-batch"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Batch
              </label>
              <input
                id="archive-batch"
                type="text"
                inputMode="numeric"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                maxLength={3}
                placeholder="e.g. 60"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="archive-description"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              id="archive-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="What will this archive be used for?"
              className={`${fieldClass} resize-none`}
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {description.length}/300
            </p>
          </div>

          {/* Live preview of the generated title */}
          <div className="rounded-lg bg-surface-secondary px-4 py-3 text-sm">
            <span className="text-muted">Archive title: </span>
            <span className="font-semibold text-foreground">
              {previewTitle ?? "—"}
            </span>
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

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
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Archive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
