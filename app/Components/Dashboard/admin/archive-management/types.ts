
export type TabType = "resources" | "questionPapers";

export type ResourceType =
  | "Notes"
  | "Lab Report"
  | "Assignment"
  | "Question Paper"
  | "Other";

export type ExamType = "Midterm" | "Final" | "Quiz" | "Other";

export interface Uploader {
  _id?: string;
  name?: string;
  universityId?: string;
}

export interface Resource {
  _id: string;
  courseName: string;
  courseCode: string;
  departmentCode: string;
  resourceTitle: string;
  resourceType: ResourceType;
  driveUrl: string;
  uploadedBy: Uploader | string;
  archiveId?: string | null;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPaper {
  _id: string;
  title: string;
  courseName: string;
  departmentName: string;
  semester: string;
  batch: string;
  section?: string;
  examType: ExamType;
  uploadedBy: Uploader | string;
  driveUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export const INITIAL_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 10,
};

export const RESOURCE_TYPES: ResourceType[] = [
  "Notes",
  "Lab Report",
  "Assignment",
  "Question Paper",
  "Other",
];

export const EXAM_TYPES: ExamType[] = [
  "Midterm",
  "Final",
  "Quiz",
  "Other",
];
