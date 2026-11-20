
import { z } from "zod";

export const createFacultyReviewSchema = z.object({
  facultyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid faculty ID."),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description cannot exceed 1000 characters."),
});

export const updateFacultyReviewStatusSchema = z.object({
  reviewId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid review ID."),
  status: z.enum(["approved", "rejected"]),
});

export type CreateFacultyReviewInput = z.infer<
  typeof createFacultyReviewSchema
>;
