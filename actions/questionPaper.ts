
"use server";

import  connectDB  from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";
import QuestionPaper from "@/models/QuestionPaper";
import { questionPaperSchema } from "@/lib/validations/questionPaper";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

interface GetQuestionPapersFilters {
  courseName?: string;
  departmentName?: string;
  semester?: string;
  batch?: string;
  examType?: string;
  section?: string;
}

export async function getQuestionPapersAction(
  filters: GetQuestionPapersFilters = {}
) {
  try {
    // 1. Authenticate user
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to view question papers.",
        papers: [],
      };
    }

    // 2. Connect database
    await connectDB();

    // 3. Build filters
    const query: Record<string, unknown> = {};

    if (filters.courseName?.trim()) {
      query.courseName = {
        $regex: filters.courseName.trim(),
        $options: "i",
      };
    }

    if (filters.departmentName?.trim()) {
      query.departmentName = filters.departmentName.trim();
    }

    if (filters.semester?.trim()) {
      query.semester = filters.semester.trim();
    }

    if (filters.batch?.trim()) {
      query.batch = filters.batch.trim();
    }

    if (filters.examType?.trim()) {
      query.examType = filters.examType.trim();
    }

    if (filters.section?.trim()) {
      query.section = filters.section.trim();
    }

    // 4. Fetch question papers
    const papers = await QuestionPaper.find(query)
      .populate("uploadedBy", "name universityId")
      .sort({ createdAt: -1 })
      .lean();

    // 5. Return serialized data
    return {
      success: true,
      message: "Question papers fetched successfully.",
      papers: JSON.parse(JSON.stringify(papers)),
    };
  } catch (error) {
    console.error("Get question papers error:", error);

    return {
      success: false,
      message: "Failed to fetch question papers.",
      papers: [],
    };
  }
}

export async function createQuestionPaperAction(data: unknown) {
  try {
    // 1. Authenticate user
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to upload a question paper.",
      };
    }

    // 2. Validate data
    const validation = questionPaperSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Please check the submitted information.",
        errors: validation.error.flatten().fieldErrors,
      };
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

    // 3. Build duplicate filter
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

    // 4. Check duplicate
    const existingPaper = await QuestionPaper.findOne(
      duplicateFilter
    ).collation({ locale: "en", strength: 2 });

    if (existingPaper) {
      return {
        success: false,
        message:
          examType === "Quiz"
            ? "A quiz paper for this course, batch, semester, and section already exists."
            : `A ${examType} paper for this course, batch, and semester already exists.`,
      };
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

    revalidatePath("/dashboard/student/question-bank");
    return {
      success: true,
      message: "Question paper uploaded successfully!",
      questionPaper: JSON.parse(JSON.stringify(questionPaper)),
    };
  } catch (error: unknown) {
    console.error("Create Question Paper Error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return {
        success: false,
        message: "This question paper already exists.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while uploading the question paper.",
    };
  }
}

// GET MY QUESTION PAPERS
// Fetch only papers uploaded by the logged-in student

export async function getMyQuestionPapersAction() {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        papers: [],
        message: "Please login first.",
      };
    }

    if (auth.user.role !== "student") {
      return {
        success: false,
        papers: [],
        message: "Only students can view their contributions.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(auth.user.id)) {
      return {
        success: false,
        papers: [],
        message: "Invalid user information.",
      };
    }

    await connectDB();

    const papers = await QuestionPaper.find({
      uploadedBy: new mongoose.Types.ObjectId(auth.user.id),
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      papers: JSON.parse(JSON.stringify(papers)),
    };
  } catch (error) {
    console.error("Get my question papers error:", error);

    return {
      success: false,
      papers: [],
      message: "Failed to fetch your question papers.",
    };
  }
}