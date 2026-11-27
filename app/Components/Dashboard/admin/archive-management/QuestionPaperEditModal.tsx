"use client";

import { X, Pencil, Loader2, AlertCircle } from "lucide-react";
import type { FormEvent } from "react";
import type { QuestionPaper } from "./types";
import { EXAM_TYPES } from "./types";

interface Props {
  paper: QuestionPaper | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-muted-foreground";

export default function QuestionPaperEditModal({
  paper,
  saving,
  onClose,
  onSubmit,
}: Props) {
  if (!paper) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Edit Question Paper
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Update question paper information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-5">
          <div>
            <label className={labelClass}>Paper title</label>
            <input
              name="title"
              defaultValue={paper.title}
              required
              minLength={3}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Course name</label>
              <input
                name="courseName"
                defaultValue={paper.courseName}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Department name</label>
              <input
                name="departmentName"
                defaultValue={paper.departmentName}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Semester</label>
              <input
                name="semester"
                defaultValue={paper.semester}
                placeholder="e.g. 3.2"
                pattern="[0-9]+\.[0-9]+"
                title="Enter semester in format 3.2"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Batch</label>
              <input
                name="batch"
                defaultValue={paper.batch}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Exam type</label>
              <select
                name="examType"
                defaultValue={paper.examType}
                required
                className={inputClass}
              >
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
                name="section"
                defaultValue={paper.section || ""}
                placeholder="Required for Quiz"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Google Drive URL</label>
            <input
              name="driveUrl"
              type="url"
              defaultValue={paper.driveUrl}
              required
              className={inputClass}
            />
          </div>

          <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <AlertCircle size={14} className="mb-1 inline" /> Quiz papers
            require a section. Duplicate papers are not allowed.
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil size={15} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
