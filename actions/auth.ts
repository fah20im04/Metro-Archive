
"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import connectDB from "@/lib/mongodb";
import User from "@/models/user";

import {
  registerSchema,
  loginSchema,
} from "@/lib/validations/auth";

import {
  SESSION_COOKIE,
  sessionCookieOptions,
  createSessionToken,
} from "@/lib/auth";

// ----------------------------------------
// COMMON RESPONSE TYPE
// ----------------------------------------

type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

// ----------------------------------------
// REGISTER ACTION
// ----------------------------------------

export async function registerAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Validate registration data
    const validated = registerSchema.safeParse({
      name: formData.get("name"),
      universityId: formData.get("universityId"),
      email: formData.get("email"),
      password: formData.get("password"),
      departmentId: formData.get("departmentId") || undefined,
      batch: formData.get("batch") || undefined,
    });

    if (!validated.success) {
      return {
        success: false,
        message: "Please correct the errors.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    await connectDB();

    // Normalize university ID
    const universityId = data.universityId.toUpperCase();

    // Validate department ID if provided
    let departmentId: Types.ObjectId | null = null;

    if (data.departmentId) {
      if (!Types.ObjectId.isValid(data.departmentId)) {
        return {
          success: false,
          message: "Invalid department selected.",
        };
      }

      departmentId = new Types.ObjectId(data.departmentId);
    }

    // Check for duplicate university ID or email
    const existingUser = await User.findOne({
      $or: [
        { universityId },
        { email: data.email },
      ],
    });

    if (existingUser) {
      return {
        success: false,
        message:
          "An account with this University ID or email already exists.",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create student account
    await User.create({
      name: data.name,
      universityId,
      email: data.email,
      passwordHash,
      role: "student",
      departmentId,
      batch: data.batch || null,
      accountStatus: "active",
    });

    return {
      success: true,
      message: "Registration successful. You can now log in.",
    };
  } catch (error) {
    // Handle duplicate key errors
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === 11000
    ) {
      return {
        success: false,
        message:
          "An account with this University ID or email already exists.",
      };
    }

    console.error("Registration action error:", error);

    return {
      success: false,
      message: "Something went wrong during registration.",
    };
  }
}

// ----------------------------------------
// LOGIN ACTION
// ----------------------------------------

export async function loginAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const validated = loginSchema.safeParse({
      universityId: formData.get("universityId"),
      password: formData.get("password"),
    });

    if (!validated.success) {
      return {
        success: false,
        message: "Please check your login information.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    await connectDB();

    const user = await User.findOne({
      universityId: data.universityId.toUpperCase(),
    }).select("+passwordHash");

    if (!user) {
      return {
        success: false,
        message: "Invalid University ID or password.",
      };
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return {
        success: false,
        message: "Invalid University ID or password.",
      };
    }

    if (user.accountStatus !== "active") {
      return {
        success: false,
        message: "Your account is not active.",
      };
    }

    const token = await createSessionToken(
      user._id.toString(),
      user.role
    );

    const cookieStore = await cookies();

    cookieStore.set(
      SESSION_COOKIE,
      token,
      sessionCookieOptions
    );

    return {
      success: true,
      message: "Login successful.",
    };
  } catch (error) {
    console.error("Login action error:", error);

    return {
      success: false,
      message: "Something went wrong during login.",
    };
  }
}

// ----------------------------------------
// LOGOUT ACTION
// ----------------------------------------

export async function logoutAction(): Promise<ActionResponse> {
  try {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, "", {
      ...sessionCookieOptions,
      maxAge: 0,
    });

    return {
      success: true,
      message: "Logged out successfully.",
    };
  } catch (error) {
    console.error("Logout action error:", error);

    return {
      success: false,
      message: "Something went wrong during logout.",
    };
  }
}
