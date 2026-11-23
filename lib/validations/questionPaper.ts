
import { z } from "zod";

export const questionPaperSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long"),

    courseName: z
      .string()
      .trim()
      .min(2, "Course name is required"),

    departmentName: z
      .string()
      .trim()
      .min(2, "Department name is required"),

    semester: z
      .string()
      .trim()
      .regex(/^\d+\.\d+$/, "Use a format like 3.2 or 3.3"),

    batch: z
      .string()
      .trim()
      .min(1, "Batch is required"),

    section: z.string().trim().optional(),

    examType: z.enum(["Midterm", "Final", "Quiz", "Other"]),

    driveUrl: z
      .string()
      .trim()
      .url("Please provide a valid Google Drive link")
      .refine((value) => {
        try {
          const hostname = new URL(value).hostname;

          return (
            hostname === "drive.google.com" ||
            hostname === "docs.google.com"
          );
        } catch {
          return false;
        }
      }, "Please provide a valid Google Drive link"),
  })
  .superRefine((data, ctx) => {
    if (data.examType === "Quiz" && !data.section) {
      ctx.addIssue({
        code: "custom",
        path: ["section"],
        message: "Section is required for quiz papers",
      });
    }
  });

export type QuestionPaperInput = z.infer<typeof questionPaperSchema>;
