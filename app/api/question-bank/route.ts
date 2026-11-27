
import { NextRequest, NextResponse } from "next/server";

import  connectDB  from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";
import QuestionPaper from "@/models/QuestionPaper";
import { questionPaperSchema } from "@/lib/validations/questionPaper";
import mongoose from "mongoose";

// Escape special regex characters in search input
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ==========================================
// POST: Upload a question paper
// ==========================================
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to upload a question paper.",
        },
        { status: 401 }
      );
    }

    // 2. Read request body
    const body = await request.json();

    // 3. Validate request data
    const validation = questionPaperSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      title,
      courseName,
      departmentName,
      semester,
      batch,
      section,
      examType,
      driveUrl,
    } = validation.data;

    await connectDB();

    // 4. Check duplicate based on exam type
    const duplicateFilter =
      examType === "Quiz"
        ? {
            courseName,
            batch,
            semester,
            section,
            examType,
          }
        : {
            courseName,
            batch,
            semester,
            examType,
          };

    const existingPaper = await QuestionPaper.findOne(
      duplicateFilter
    ).collation({ locale: "en", strength: 2 });

    if (existingPaper) {
      return NextResponse.json(
        {
          success: false,
          message:
            examType === "Quiz"
              ? "A quiz paper for this course, batch, semester, and section already exists."
              : `A ${examType} paper for this course, batch, and semester already exists.`,
        },
        { status: 409 }
      );
    }

    // 5. Create question paper
    const questionPaper = await QuestionPaper.create({
      title,
      courseName,
      departmentName,
      semester,
      batch,
      ...(examType === "Quiz" ? { section } : {}),
      examType,
      driveUrl,
      uploadedBy: new mongoose.Types.ObjectId(auth.user.id),
    });

    // 6. Populate uploader information
    await questionPaper.populate("uploadedBy", "name universityId");

    return NextResponse.json(
      {
        success: true,
        message: "Question paper uploaded successfully!",
        questionPaper: JSON.parse(JSON.stringify(questionPaper)),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Question Paper POST Error:", error);

    // Handle duplicate key errors from MongoDB indexes
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This question paper already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while uploading the question paper.",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// GET: Fetch question papers
// ==========================================
export async function GET(request: NextRequest) {
  try {
    // 1. Check authentication
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view question papers.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // 2. Read query parameters
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const courseName = searchParams.get("courseName");
    const departmentName = searchParams.get("departmentName");
    const semester = searchParams.get("semester");
    const batch = searchParams.get("batch");
    const section = searchParams.get("section");
    const examType = searchParams.get("examType");

    // 3. Build filter
    const filter: Record<string, unknown> = {};

    if (courseName) filter.courseName = courseName;
    if (departmentName) filter.departmentName = departmentName;
    if (semester) filter.semester = semester;
    if (batch) filter.batch = batch;
    if (section) filter.section = section;
    if (examType) filter.examType = examType;

    // Search by title, course, department, or batch
    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { title: searchRegex },
        { courseName: searchRegex },
        { departmentName: searchRegex },
        { batch: searchRegex },
      ];
    }

    // 4. Fetch question papers and uploader details
    const questionPapers = await QuestionPaper.find(filter)
      .populate("uploadedBy", "name universityId")
      .collation({ locale: "en", strength: 2 })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: questionPapers.length,
        questionPapers: JSON.parse(JSON.stringify(questionPapers)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Question Paper GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching question papers.",
      },
      { status: 500 }
    );
  }
}
