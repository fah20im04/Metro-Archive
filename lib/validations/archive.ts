import { z } from "zod";

import { ARCHIVE_DEPARTMENTS, SEMESTERS } from "@/lib/archive";

export const createArchiveSchema = z.object({
  semester: z
    .string()
    .refine((value) => SEMESTERS.includes(value), "Please select a semester."),

  department: z
    .string()
    .refine(
      (value) => ARCHIVE_DEPARTMENTS.includes(value),
      "Please select a department."
    ),

  // Batch number, e.g. "60"
  batch: z
    .string()
    .trim()
    .regex(/^\d{1,3}$/, "Batch must be a number, e.g. 60.")
    .transform((value) => String(Number(value))),

  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters.")
    .optional()
    .default(""),
});

export type CreateArchiveInput = z.infer<typeof createArchiveSchema>;
