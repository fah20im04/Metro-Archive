
import { z } from "zod";

// registration validation
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  universityId: z
    .string()
    .trim()
    .min(1, "University ID is required")
    .max(50, "University ID is too long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),

  batch: z
    .string()
    .trim()
    .max(50)
    .optional(),
});


// Login validation
export const loginSchema = z.object({
  universityId: z
    .string()
    .trim()
    .min(1, "University ID is required")
    .max(50, "Invalid university ID"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Invalid password"),
});
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
