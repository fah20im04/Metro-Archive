"use server";

import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
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


interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "all" | "student" | "admin";
  status?: "all" | "pending" | "active" | "suspended";
  department?: string;
}

export async function getAdminUsersAction(
  params: GetAdminUsersParams = {}
) {
  try {
    // 1. Admin authentication
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        users: [],
        pagination: null,
        message: "Please login first.",
      };
    }

    if (auth.user.role !== "admin") {
      return {
        success: false,
        users: [],
        pagination: null,
        message: "Unauthorized access.",
      };
    }

    await connectDB();

    // 2. Pagination
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const limit = Math.min(50, Math.max(1, Math.floor(params.limit ?? 10)));
    const skip = (page - 1) * limit;

    // 3. Base filter: students and admins only
    const filter: Record<string, unknown> = {
      role: { $in: ["student", "admin"] },
    };

    // 4. Role filter
    if (params.role && params.role !== "all") {
      filter.role = params.role;
    }

    // 5. Account status filter
    if (params.status && params.status !== "all") {
      filter.accountStatus = params.status;
    }

    // 6. Department filter
    if (params.department && params.department !== "all") {
      filter.departmentName = params.department;
    }

    // 7. Search by name, university ID or email
    if (params.search?.trim()) {
      const escapedSearch = params.search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { name: searchRegex },
        { universityId: searchRegex },
        { email: searchRegex },
      ];
    }

    // 8. Fetch users and total count
    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select(
          "name universityId email role departmentName batch accountStatus createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return {
      success: true,
      users: JSON.parse(JSON.stringify(users)),
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    };
  } catch (error) {
    console.error("Get admin users error:", error);

    return {
      success: false,
      users: [],
      pagination: null,
      message: "Failed to fetch users.",
    };
  }
}

interface UpdateAdminUserData {
  name: string;
  universityId: string;
  email: string;
  departmentName?: string | null;
  batch?: string | null;
}

export async function updateAdminUserAction(
  userId: string,
  data: UpdateAdminUserData
) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user || auth.user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { success: false, message: "Invalid user ID." };
    }

    const name = data.name?.trim();
    const universityId = data.universityId?.trim().toUpperCase();
    const email = data.email?.trim().toLowerCase();

    if (!name || name.length < 2 || name.length > 100) {
      return {
        success: false,
        message: "Name must be between 2 and 100 characters.",
      };
    }

    if (!universityId || !/^[A-Z0-9-]+$/.test(universityId)) {
      return {
        success: false,
        message: "Please enter a valid university ID.",
      };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    await connectDB();

    const existingUser = await User.findById(userId).select("_id role");

    if (!existingUser || !["student", "admin"].includes(existingUser.role)) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Check for duplicate university ID or email
    const duplicate = await User.findOne({
      _id: { $ne: userId },
      $or: [{ universityId }, { email }],
    }).select("universityId email");

    if (duplicate) {
      if (duplicate.universityId === universityId) {
        return {
          success: false,
          message: "This university ID is already in use.",
        };
      }

      return {
        success: false,
        message: "This email address is already in use.",
      };
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          universityId,
          email,
          departmentName: data.departmentName?.trim().toUpperCase() || null,
          batch: data.batch?.trim() || null,
        },
      },
      { runValidators: true }
    );

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "User details updated successfully.",
    };
  } catch (error) {
    console.error("Update admin user error:", error);

    return {
      success: false,
      message: "Failed to update user details.",
    };
  }
}


export async function updateAdminUserStatusAction(
  userId: string,
  status: "active" | "suspended"
) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user || auth.user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { success: false, message: "Invalid user ID." };
    }

    if (!["active", "suspended"].includes(status)) {
      return { success: false, message: "Invalid account status." };
    }

    if (String(auth.user.id) === userId) {
      return {
        success: false,
        message: "You cannot change your own account status.",
      };
    }

    await connectDB();

    const targetUser = await User.findById(userId).select(
      "_id role accountStatus"
    );

    if (!targetUser || !["student", "admin"].includes(targetUser.role)) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Do not suspend the last active administrator
    if (
      targetUser.role === "admin" &&
      targetUser.accountStatus === "active" &&
      status === "suspended"
    ) {
      const activeAdmins = await User.countDocuments({
        role: "admin",
        accountStatus: "active",
      });

      if (activeAdmins <= 1) {
        return {
          success: false,
          message: "You cannot suspend the last active administrator.",
        };
      }
    }

    await User.findByIdAndUpdate(
      userId,
      { $set: { accountStatus: status } },
      { runValidators: true }
    );

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard");

    return {
      success: true,
      message:
        status === "active"
          ? "Account activated successfully."
          : "Account suspended successfully.",
    };
  } catch (error) {
    console.error("Update user status error:", error);

    return {
      success: false,
      message: "Failed to update account status.",
    };
  }
}

