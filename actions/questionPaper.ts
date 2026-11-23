
"use server";

import  connectDB  from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";
import QuestionPaper from "@/models/QuestionPaper";
import { questionPaperSchema } from "@/lib/validations/questionPaper";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

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

    revalidatePath("/question-bank");

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
