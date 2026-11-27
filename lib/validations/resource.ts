
import { z } from "zod";

const googleDriveUrlSchema = z
  .string()
  .trim()
  .url("Please enter a valid URL")
  .refine((value) => {
    try {
      const url = new URL(value);

      return (
        url.protocol === "https:" &&
        (
          url.hostname === "drive.google.com" ||
          url.hostname === "docs.google.com"
        )
      );
    } catch {
      return false;
    }
  }, "Please provide a valid Google Drive sharing link");

export const createResourceSchema = z.object({
  courseName: z
    .string()
    .trim()
    .min(2, "Course name is required")
    .max(150, "Course name is too long"),

  courseCode: z
    .string()
    .trim()
    .min(2, "Course code is required")
    .max(30, "Course code is too long"),

  departmentCode: z
    .string()
    .trim()
    .min(2, "Department is required")
    .max(20, "Department code is too long"),

  resourceTitle: z
    .string()
    .trim()
    .min(3, "Resource title must be at least 3 characters")
    .max(150, "Resource title is too long"),

  resourceType: z.enum([
    "Notes",
    "Lab Report",
    "Assignment",
    "Question Paper",
    "Other",
  ]),

  driveUrl: googleDriveUrlSchema,
});

export type CreateResourceInput = z.infer<
  typeof createResourceSchema
>;
