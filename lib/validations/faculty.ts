
import { z } from "zod";

// Create faculty validation
export const createFacultySchema = z.object({
  sourceId: z.coerce
    .number()
    .int("Faculty ID must be a whole number")
    .positive("Faculty ID must be positive"),

  name: z
    .string()
    .trim()
    .min(2, "Faculty name must be at least 2 characters")
    .max(100, "Faculty name is too long"),

  departmentIds: z
    .array(z.coerce.number().int().positive())
    .default([]),

  courseIds: z
    .array(z.coerce.number().int().positive())
    .default([]),

  designation: z
    .string()
    .trim()
    .min(2, "Designation is required")
    .max(100, "Designation is too long"),

  profileImage: z
    .union([
      z.string().url("Enter a valid image URL"),
      z.literal(""),
    ])
    .optional()
    .transform((value) => value || null),

  profileStatus: z
    .enum(["active", "inactive"])
    .default("active"),
});

// Update faculty validation
export const updateFacultySchema = createFacultySchema
  .omit({ sourceId: true })
  .partial();

export type CreateFacultyInput = z.infer<
  typeof createFacultySchema
>;

export type UpdateFacultyInput = z.infer<
  typeof updateFacultySchema
>;
