"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

export interface CreateQuestionPaperData {
  title: string;
  courseName: string;
  departmentName: string;
  semester: string;
  batch: string;
  section?: string;
  examType: string;
  driveUrl: string;
}

interface CreateQuestionPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuestionPaperData) => Promise<void>;
}

const initialForm: CreateQuestionPaperData = {
  title: "",
  courseName: "",
  departmentName: "",
  semester: "",
  batch: "",
  section: "",
  examType: "Quiz",
  driveUrl: "",
};

export default function CreateQuestionPaperModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuestionPaperModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const url = new URL(form.driveUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Please provide a valid document URL.");
      }

      setLoading(true);

      await onSubmit({
        ...form,
        title: form.title.trim(),
        courseName: form.courseName.trim(),
        departmentName: form.departmentName.trim(),
        semester: form.semester.trim(),
        batch: form.batch.trim(),
        section: form.section?.trim() || undefined,
        driveUrl: form.driveUrl.trim(),
      });

      setForm(initialForm);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload question paper.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-bold">Upload Question Paper</h2>
            <p className="mt-1 text-sm text-muted">
              Share a previous question paper with your university community.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-secondary hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                Question Paper Title
              </label>
              <input
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Data Structures Quiz 1"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Course Name
              </label>
              <input
                required
                name="courseName"
                value={form.courseName}
                onChange={handleChange}
                placeholder="e.g. Data Structures"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Department Name
              </label>
              <input
                required
                name="departmentName"
                value={form.departmentName}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Semester
              </label>
              <input
                required
                name="semester"
                value={form.semester}
                onChange={handleChange}
                placeholder="e.g. 3.2"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Batch</label>
              <input
                required
                name="batch"
                value={form.batch}
                onChange={handleChange}
                placeholder="e.g. 61"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Exam Type
              </label>
              <select
                name="examType"
                value={form.examType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Quiz">Quiz</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Assignment">Assignment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Section (Optional)
              </label>
              <input
                name="section"
                value={form.section}
                onChange={handleChange}
                placeholder="e.g. A"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                Google Drive URL
              </label>
              <input
                required
                type="url"
                name="driveUrl"
                value={form.driveUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-surface-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Uploading..." : "Upload Question Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
