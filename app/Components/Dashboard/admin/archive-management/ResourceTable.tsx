"use client";

import {
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
  Heart,
  Loader2,
} from "lucide-react";

import type { Resource } from "./types";
import { formatDate, getUploaderName, getUploaderId } from "./utils";

interface Props {
  resources: Resource[];
  deletingId: string | null;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

export default function ResourceTable({
  resources,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-semibold">Resource</th>
            <th className="px-5 py-3 font-semibold">Course</th>
            <th className="px-5 py-3 font-semibold">Department</th>
            <th className="px-5 py-3 font-semibold">Uploader</th>
            <th className="px-5 py-3 font-semibold">Likes</th>
            <th className="px-5 py-3 font-semibold">Date</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {resources.map((resource) => (
            <tr key={resource._id} className="transition hover:bg-muted/30">
              <td className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <FileText size={17} />
                  </div>

                  <div className="max-w-[220px]">
                    <p className="font-semibold text-foreground">
                      {resource.resourceTitle}
                    </p>
                    <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {resource.resourceType}
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="font-medium text-foreground">
                  {resource.courseName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resource.courseCode}
                </p>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  {resource.departmentCode}
                </span>
              </td>

              <td className="px-5 py-4">
                <p className="font-medium text-foreground">
                  {getUploaderName(resource.uploadedBy)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {getUploaderId(resource.uploadedBy)}
                </p>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Heart size={14} />
                  <span>{resource.likeCount ?? 0}</span>
                </div>
              </td>

              <td className="px-5 py-4 text-xs text-muted-foreground">
                {formatDate(resource.createdAt)}
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <a
                    href={resource.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open resource"
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                  >
                    <ExternalLink size={16} />
                  </a>

                  <button
                    type="button"
                    onClick={() => onEdit(resource)}
                    title="Edit resource"
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(resource)}
                    disabled={deletingId === resource._id}
                    title="Delete resource"
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                  >
                    {deletingId === resource._id ? (
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
