
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/user"
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Read the incoming request
    const body = await request.json();

    // 2. Validate the registration data
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your registration information.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, universityId, email, password, batch } =
      validation.data;

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Normalize university ID
    const normalizedUniversityId = universityId.toUpperCase();

    // 5. Check whether the account already exists
    const existingUser = await User.findOne({
      $or: [
        { universityId: normalizedUniversityId },
        { email },
      ],
    }).lean();

    if (existingUser) {
      const duplicateField =
        existingUser.email === email
          ? "email"
          : "university ID";

      return NextResponse.json(
        {
          success: false,
          message: `An account with this ${duplicateField} already exists.`,
        },
        { status: 409 }
      );
    }

    // 6. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 7. Create the student account
    const user = await User.create({
      name,
      universityId: normalizedUniversityId,
      email,
      passwordHash,
      batch,
      role: "student",
      accountStatus: "active",
    });

    // 8. Return a safe response
    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful! Your account is pending approval.",
        user: {
          id: user._id.toString(),
          name: user.name,
          universityId: user.universityId,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);

    // Handle duplicate-key errors caused by simultaneous requests
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This university ID or email is already registered.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during registration.",
      },
      { status: 500 }
    );
  }
}
