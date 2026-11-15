
import { z } from "zod";

// Registration validation
export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  universityId: z.string()
    .trim()
    .regex(
      /^\d{3}-\d{3}-\d{3}$/,
      "University ID must follow this format: 222-222-222"
    ),

  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .transform((value) => value.toLowerCase()),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),

  departmentName: z.string()
    .min(1, "Please select a department"),

  batch: z.string()
    .trim()
    .max(50)
    .optional(),
});

// Login validation
export const loginSchema = z.object({
  universityId: z.string()
    .trim()
    .regex(
      /^\d{3}-\d{3}-\d{3}$/,
      "University ID must follow this format: 222-222-222"
    ),

  password: z.string()
    .min(1, "Password is required")
    .max(72, "Invalid password"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
