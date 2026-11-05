
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import User from "@/models/user";
import Faculty from "@/models/Faculty";
import { createFacultySchema } from "@/lib/validations/faculty";

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

// GET: Fetch all active faculty
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const departmentId = searchParams.get("departmentId");
    const courseId = searchParams.get("courseId");

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit")) || 10)
    );

    const filter: Record<string, unknown> = {
      profileStatus: "active",
    };

    // Search faculty by name or designation
    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        {
          designation: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    // Filter by department
    if (departmentId) {
      const id = Number(departmentId);

      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid department ID." },
          { status: 400 }
        );
      }

      filter.departmentIds = id;
    }

    // Filter by course
    if (courseId) {
      const id = Number(courseId);

      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid course ID." },
          { status: 400 }
        );
      }

      filter.courseIds = id;
    }

    const skip = (page - 1) * limit;

    const [faculty, total] = await Promise.all([
      Faculty.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Faculty.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: faculty,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET FACULTY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty." },
      { status: 500 }
    );
  }
}

// POST: Create a faculty profile (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = createFacultySchema.safeParse(body);

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

    await connectDB();

    const existingFaculty = await Faculty.findOne({
      sourceId: validation.data.sourceId,
    });

    if (existingFaculty) {
      return NextResponse.json(
        {
          success: false,
          message: "Faculty with this source ID already exists.",
        },
        { status: 409 }
      );
    }

    const faculty = await Faculty.create(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Faculty created successfully.",
        data: faculty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE FACULTY ERROR:", error);

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Faculty with this source ID already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create faculty." },
      { status: 500 }
    );
  }
}
