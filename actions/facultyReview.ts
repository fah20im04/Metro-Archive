
"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";
import Faculty from "@/models/Faculty";
import FacultyReview from "@/models/FacultyReview";

import {
  createFacultyReviewSchema,
  updateFacultyReviewStatusSchema,
} from "@/lib/validations/facultyReview";

// Refresh faculty pages after review changes
function refreshFacultyPaths(facultyId?: string) {
  revalidatePath("/faculty");

  if (facultyId) {
    revalidatePath(`/faculty/${facultyId}`);
  }
}

// 1. Create a faculty review
export async function createFacultyReviewAction(data: unknown) {
  try {
    // Authenticate user
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to write a review.",
      };
    }

    // Only students can write reviews
    if (auth.user.role !== "student") {
      return {
        success: false,
        message: "Only students can write faculty reviews.",
      };
    }

    // Validate input
    const validatedData = createFacultyReviewSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.issues[0]?.message ||
          "Invalid review information.",
      };
    }

    await connectDB();

    const { facultyId, title, description } = validatedData.data;

    // Check whether faculty exists
    const facultyExists = await Faculty.exists({
      _id: facultyId,
    });

    if (!facultyExists) {
      return {
        success: false,
        message: "Faculty member not found.",
      };
    }

    // Create review
    await FacultyReview.create({
      facultyId: new mongoose.Types.ObjectId(facultyId),
      userId: auth.user.id,
      title,
      description,
      status: "pending",
    });

    return {
      success: true,
      message: "Your review has been submitted for moderation.",
    };
  } catch (error: unknown) {
    // Duplicate review
    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      return {
        success: false,
        message: "You have already reviewed this faculty member.",
      };
    }

    console.error("Create faculty review error:", error);

    return {
      success: false,
      message: "Something went wrong while submitting your review.",
    };
  }
}

// 2. Get approved reviews for a faculty member
export async function getFacultyReviewsAction(facultyId: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return {
        success: false,
        reviews: [],
        message: "Invalid faculty ID.",
      };
    }

    await connectDB();

    const reviews = await FacultyReview.find({
      facultyId,
      status: "approved",
    })
      .populate("userId", "name universityId")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      reviews: JSON.parse(JSON.stringify(reviews)),
    };
  } catch (error) {
    console.error("Get faculty reviews error:", error);

    return {
      success: false,
      reviews: [],
      message: "Failed to fetch faculty reviews.",
    };
  }
}

// 3. Get reviews written by the logged-in student
export async function getMyFacultyReviewsAction() {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        reviews: [],
        message: "Please login first.",
      };
    }

    await connectDB();

    const reviews = await FacultyReview.find({
      userId: auth.user.id,
    })
      .populate("facultyId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      reviews: JSON.parse(JSON.stringify(reviews)),
    };
  } catch (error) {
    console.error("Get my faculty reviews error:", error);

    return {
      success: false,
      reviews: [],
      message: "Failed to fetch your reviews.",
    };
  }
}

// 4. Admin approves or rejects a review
export async function updateFacultyReviewStatusAction(data: unknown) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    if (auth.user.role !== "admin") {
      return {
        success: false,
        message: "Only admins can moderate reviews.",
      };
    }

    const validatedData =
      updateFacultyReviewStatusSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid review information.",
      };
    }

    await connectDB();

    const { reviewId, status } = validatedData.data;

    const review = await FacultyReview.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      return {
        success: false,
        message: "Review not found.",
      };
    }

    refreshFacultyPaths(review.facultyId.toString());

    return {
      success: true,
      message: `Review ${status} successfully.`,
    };
  } catch (error) {
    console.error("Update faculty review status error:", error);

    return {
      success: false,
      message: "Failed to update review status.",
    };
  }
}

// 5. Delete a review (owner or admin)
export async function deleteFacultyReviewAction(reviewId: string) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return {
        success: false,
        message: "Invalid review ID.",
      };
    }

    await connectDB();

    const review = await FacultyReview.findById(reviewId);

    if (!review) {
      return {
        success: false,
        message: "Review not found.",
      };
    }

    const isOwner =
      review.userId.toString() === auth.user.id.toString();

    const isAdmin = auth.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        message: "You are not allowed to delete this review.",
      };
    }

    const facultyId = review.facultyId.toString();

    await FacultyReview.findByIdAndDelete(reviewId);

    refreshFacultyPaths(facultyId);

    return {
      success: true,
      message: "Review deleted successfully.",
    };
  } catch (error) {
    console.error("Delete faculty review error:", error);

    return {
      success: false,
      message: "Failed to delete review.",
    };
  }
}
