"use client";

import {
  ClipboardList,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

import type { QuestionPaper } from "./types";
import { formatDate, getUploaderName, getUploaderId } from "./utils";

interface Props {
  papers: QuestionPaper[];
  deletingId: string | null;
  onEdit: (paper: QuestionPaper) => void;
  onDelete: (paper: QuestionPaper) => void;
}

export default function QuestionPaperTable({
  papers,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-semibold">Question Paper</th>
            <th className="px-5 py-3 font-semibold">Course</th>
            <th className="px-5 py-3 font-semibold">Department</th>
            <th className="px-5 py-3 font-semibold">Semester</th>
            <th className="px-5 py-3 font-semibold">Batch / Section</th>
            <th className="px-5 py-3 font-semibold">Uploader</th>
            <th className="px-5 py-3 font-semibold">Exam</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {papers.map((paper) => (
            <tr key={paper._id} className="transition hover:bg-muted/30">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <ClipboardList size={17} />
                  </div>

                  <div className="max-w-[190px]">
                    <p className="font-semibold text-foreground">
                      {paper.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(paper.createdAt)}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 font-medium text-foreground">
                {paper.courseName}
              </td>

              <td className="px-5 py-4 text-muted-foreground">
                {paper.departmentName}
              </td>

              <td className="px-5 py-4">
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  {paper.semester}
                </span>
              </td>

              <td className="px-5 py-4">
                <p className="font-medium text-foreground">{paper.batch}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {paper.section ? `Section ${paper.section}` : "No section"}
                </p>
              </td>

              <td className="px-5 py-4">
                <p className="font-medium text-foreground">
                  {getUploaderName(paper.uploadedBy)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {getUploaderId(paper.uploadedBy)}
                </p>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {paper.examType}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <a
                    href={paper.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open question paper"
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                  >
                    <ExternalLink size={16} />
                  </a>

                  <button
                    type="button"
                    onClick={() => onEdit(paper)}
                    title="Edit question paper"
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(paper)}
                    disabled={deletingId === paper._id}
                    title="Delete question paper"
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                  >
                    {deletingId === paper._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
