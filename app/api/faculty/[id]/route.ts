
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import User from "@/models/user";
import Faculty from "@/models/Faculty";
import { updateFacultySchema } from "@/lib/validations/faculty";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Check whether the current user is an active admin
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const session = await verifySessionToken(token);

  if (!session?.userId) return null;

  await connectDB();

  const user = await User.findById(session.userId)
    .select("role accountStatus")
    .lean();

  if (
    !user ||
    user.role !== "admin" ||
    user.accountStatus !== "active"
  ) {
    return null;
  }

  return user;
}

// Validate MongoDB ObjectId
function isValidId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

// GET: Fetch one active faculty member
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid faculty ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const faculty = await Faculty.findOne({
      _id: id,
      profileStatus: "active",
    }).lean();

    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error("GET SINGLE FACULTY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty." },
      { status: 500 }
    );
  }
}

// PATCH: Update a faculty member (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid faculty ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = updateFacultySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid faculty data.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided." },
        { status: 400 }
      );
    }

    await connectDB();

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      { $set: validation.data },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Faculty updated successfully.",
      data: faculty,
    });
  } catch (error) {
    console.error("UPDATE FACULTY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update faculty." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a faculty member (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid faculty ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Faculty deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE FACULTY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete faculty." },
      { status: 500 }
    );
  }
}
