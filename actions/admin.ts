"use server";

import connectDB from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";

import User from "@/models/user";
import Faculty from "@/models/Faculty";
import Resource from "@/models/Resource";
import QuestionPaper from "@/models/QuestionPaper";
import FacultyReview from "@/models/FacultyReview";

export async function getAdminDashboardStatsAction() {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login first.",
        stats: null,
      };
    }

    if (auth.user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized access.",
        stats: null,
      };
    }

    await connectDB();

    const [
      totalStudents,
      totalFaculty,
      totalResources,
      totalQuestionPapers,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Faculty.countDocuments({}),
      Resource.countDocuments({}),
      QuestionPaper.countDocuments({}),
    ]);

    return {
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalResources,
        totalQuestionPapers,
      },
    };
  } catch (error) {
    console.error("Admin dashboard stats error:", error);

    return {
      success: false,
      message: "Failed to load dashboard statistics.",
      stats: null,
    };
  }
}

// 6. Get all faculty reviews for admin moderation
export async function getAdminFacultyReviewsAction() {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        reviews: [],
        message: "Please login first.",
      };
    }

    if (auth.user.role !== "admin") {
      return {
        success: false,
        reviews: [],
        message: "Only admins can access faculty reviews.",
      };
    }

    await connectDB();

    const reviews = await FacultyReview.find({})
      .populate("facultyId", "name departmentIds designation")
      .populate("userId", "name universityId departmentName batch")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      reviews: JSON.parse(JSON.stringify(reviews)),
    };
  } catch (error) {
    console.error("Get admin faculty reviews error:", error);

    return {
      success: false,
      reviews: [],
      message: "Failed to fetch faculty reviews.",
    };
  }
}