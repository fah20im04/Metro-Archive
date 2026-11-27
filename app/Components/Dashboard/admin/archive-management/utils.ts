
import type { Uploader } from "./types";

export function getUploaderName(uploader: Uploader | string) {
  if (typeof uploader === "string") return "Unknown user";
  return uploader?.name || "Unknown user";
}

export function getUploaderId(uploader: Uploader | string) {
  if (typeof uploader === "string") return "";
  return uploader?.universityId || "";
}

export function formatDate(date: string) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
