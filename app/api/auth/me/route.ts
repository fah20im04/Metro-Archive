
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/user";

import {
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 1. Get the session cookie
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authenticated.",
          user: null,
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    // 2. Verify the JWT
    const session = await verifySessionToken(token);

    if (!session) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Your session is invalid or has expired.",
          user: null,
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );

      // Clear invalid session cookie
      response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Find the latest user information
    const user = await User.findById(session.userId)
      .select(
        "name universityId email role departmentId batch accountStatus createdAt"
      )
      .lean();

    if (!user) {
      const response = NextResponse.json(
        {
          success: false,
          message: "User account not found.",
          user: null,
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );

      response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    // 5. Check the latest account status
    if (user.accountStatus !== "active") {
      const response = NextResponse.json(
        {
          success: false,
          message:
            user.accountStatus === "pending"
              ? "Your account is awaiting approval."
              : "Your account has been suspended.",
          user: null,
        },
        {
          status: 403,
          headers: { "Cache-Control": "no-store" },
        }
      );

      // Prevent further use of this session
      response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    // 6. Return safe user information
    return NextResponse.json(
      {
        success: true,
        message: "Authenticated successfully.",
        user: {
          id: user._id.toString(),
          name: user.name,
          universityId: user.universityId,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId?.toString() ?? null,
          batch: user.batch ?? null,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: unknown) {
    console.error("Session verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify your session.",
        user: null,
      },
      { status: 500 }
    );
  }
}
