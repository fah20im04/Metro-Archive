
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/user";

import { loginSchema } from "@/lib/validations/auth";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Read request body
    const body = await request.json();

    // 2. Validate login information
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide valid login information.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { universityId, password } = validation.data;

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Find user using normalized university ID
    // passwordHash is normally hidden, so explicitly select it.
    const user = await User.findOne({
      universityId: universityId.toUpperCase(),
    }).select("+passwordHash");

    // 5. Check credentials
    // Use the same error for unknown IDs and wrong passwords.
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid university ID or password.",
        },
        { status: 401 }
      );
    }

    // 6. Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid university ID or password.",
        },
        { status: 401 }
      );
    }

    // 7. Check account status
    if (user.accountStatus !== "active") {
      const message =
        user.accountStatus === "pending"
          ? "Your account is awaiting approval."
          : "Your account has been suspended.";

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 403 }
      );
    }

    // 8. Create JWT session
    const token = await createSessionToken(
      user._id.toString(),
      user.role
    );

    // 9. Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        user: {
          id: user._id.toString(),
          name: user.name,
          universityId: user.universityId,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId?.toString() ?? null,
          batch: user.batch ?? null,
          accountStatus: user.accountStatus,
        },
      },
      { status: 200 }
    );

    // 10. Set secure HTTP-only cookie
    response.cookies.set(
      SESSION_COOKIE,
      token,
      sessionCookieOptions
    );

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during login.",
      },
      { status: 500 }
    );
  }
}
