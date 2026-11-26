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

// Student reports (charts) for admin
export async function getAdminStudentReportsAction(filters?: {
  department?: string;
  batch?: string;
}) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return { success: false as const, message: "Please login first." };
    }

    if (auth.user.role !== "admin") {
      return { success: false as const, message: "Unauthorized access." };
    }

    await connectDB();

    const department = filters?.department?.trim().toUpperCase() || "";
    const batch = filters?.batch?.trim() || "";

    const match: Record<string, unknown> = { role: "student" };

    if (department) match.departmentName = department;
    if (batch) match.batch = batch;

    // Last 12 months, including the current one (UTC)
    const now = new Date();
    const monthKeys: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      monthKeys.push(
        `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
      );
    }

    const rangeStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1),
    );

    const [byDepartmentRaw, registrationsRaw, matrixRaw, departmentOptions, batchOptions] =
      await Promise.all([
        User.aggregate([
          { $match: match },
          {
            $group: {
              _id: { $ifNull: ["$departmentName", "Unassigned"] },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1, _id: 1 } },
        ]),
        User.aggregate([
          { $match: { ...match, createdAt: { $gte: rangeStart } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
        ]),
        User.aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                department: { $ifNull: ["$departmentName", "Unassigned"] },
                batch: { $ifNull: ["$batch", "N/A"] },
              },
              count: { $sum: 1 },
            },
          },
        ]),
        User.distinct("departmentName", { role: "student" }),
        User.distinct("batch", { role: "student" }),
      ]);

    const byDepartment = byDepartmentRaw.map((item) => ({
      department: String(item._id),
      count: item.count as number,
    }));

    const monthLabel = (key: string) => {
      const [year, month] = key.split("-").map(Number);

      return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
        "en-GB",
        { month: "short", year: "2-digit", timeZone: "UTC" },
      );
    };

    const registrationMap = new Map<string, number>(
      registrationsRaw.map((item) => [String(item._id), item.count as number]),
    );

    const registrations = monthKeys.map((key) => ({
      month: monthLabel(key),
      count: registrationMap.get(key) ?? 0,
    }));

    // Department x batch matrix for the stacked bar chart
    const batches = Array.from(
      new Set(matrixRaw.map((item) => String(item._id.batch))),
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const rowMap = new Map<string, Record<string, string | number>>();

    for (const item of matrixRaw) {
      const dept = String(item._id.department);
      const row = rowMap.get(dept) ?? { department: dept };

      row[String(item._id.batch)] = item.count as number;
      rowMap.set(dept, row);
    }

    const total = (row: Record<string, string | number>) =>
      batches.reduce((sum, b) => sum + (Number(row[b]) || 0), 0);

    const departmentBatch = Array.from(rowMap.values()).sort(
      (a, b) => total(b) - total(a),
    );

    return {
      success: true as const,
      data: {
        totalStudents: byDepartment.reduce((sum, d) => sum + d.count, 0),
        byDepartment,
        registrations,
        departmentBatch: { batches, rows: departmentBatch },
        filterOptions: {
          departments: (departmentOptions as (string | null)[])
            .filter((v): v is string => Boolean(v))
            .sort(),
          batches: (batchOptions as (string | null)[])
            .filter((v): v is string => Boolean(v))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
        },
      },
    };
  } catch (error) {
    console.error("Admin student reports error:", error);

    return {
      success: false as const,
      message: "Failed to load student reports.",
    };
  }
}

// Faculty reports (charts) for admin
export async function getAdminFacultyReportsAction(filters?: {
  department?: string;
  designation?: string;
}) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return { success: false as const, message: "Please login first." };
    }

    if (auth.user.role !== "admin") {
      return { success: false as const, message: "Unauthorized access." };
    }

    await connectDB();

    const department = filters?.department?.trim() || "";
    const designation = filters?.designation?.trim() || "";

    const match: Record<string, unknown> = {};

    if (department) match.departmentNames = department;
    if (designation) match.designation = designation;

    const [
      byDepartmentRaw,
      byDesignationRaw,
      topUpvotedRaw,
      totalsRaw,
      reviewStatusRaw,
      departmentOptions,
      designationOptions,
    ] = await Promise.all([
      Faculty.aggregate([
        { $match: match },
        { $unwind: "$departmentNames" },
        ...(department ? [{ $match: { departmentNames: department } }] : []),
        { $group: { _id: "$departmentNames", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
      Faculty.aggregate([
        { $match: match },
        { $group: { _id: "$designation", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
      Faculty.find({ ...match, upvoteCount: { $gt: 0 } })
        .sort({ upvoteCount: -1, name: 1 })
        .limit(10)
        .select("name upvoteCount")
        .lean(),
      Faculty.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalFaculty: { $sum: 1 },
            totalUpvotes: { $sum: "$upvoteCount" },
          },
        },
      ]),
      FacultyReview.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Faculty.distinct("departmentNames"),
      Faculty.distinct("designation"),
    ]);

    const statusCount = (status: string) =>
      (reviewStatusRaw.find((item) => item._id === status)?.count as
        | number
        | undefined) ?? 0;

    return {
      success: true as const,
      data: {
        totalFaculty: (totalsRaw[0]?.totalFaculty as number | undefined) ?? 0,
        totalUpvotes: (totalsRaw[0]?.totalUpvotes as number | undefined) ?? 0,
        pendingReviews: statusCount("pending"),
        byDepartment: byDepartmentRaw.map((item) => ({
          department: String(item._id),
          count: item.count as number,
        })),
        byDesignation: byDesignationRaw.map((item) => ({
          designation: String(item._id),
          count: item.count as number,
        })),
        topUpvoted: topUpvotedRaw.map((item) => ({
          name: String(item.name),
          upvotes: Number(item.upvoteCount),
        })),
        reviewsByStatus: [
          { status: "approved", count: statusCount("approved") },
          { status: "pending", count: statusCount("pending") },
          { status: "rejected", count: statusCount("rejected") },
        ],
        filterOptions: {
          departments: (departmentOptions as string[]).filter(Boolean).sort(),
          designations: (designationOptions as string[]).filter(Boolean).sort(),
        },
      },
    };
  } catch (error) {
    console.error("Admin faculty reports error:", error);

    return {
      success: false as const,
      message: "Failed to load faculty reports.",
    };
  }
}
// Faculty management overview (KPIs) 
export async function getAdminFacultyOverviewAction() {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return { success: false as const, message: "Please login first." };
    }

    if (auth.user.role !== "admin") {
      return { success: false as const, message: "Unauthorized access." };
    }

    await connectDB();

    const [
      totalFaculty,
      activeFaculty,
      inactiveFaculty,
      upvotesRaw,
      pendingReviews,
      totalReviews,
    ] = await Promise.all([
      Faculty.countDocuments({}),
      Faculty.countDocuments({ profileStatus: "active" }),
      Faculty.countDocuments({ profileStatus: "inactive" }),
      Faculty.aggregate([
        { $group: { _id: null, total: { $sum: "$upvoteCount" } } },
      ]),
      FacultyReview.countDocuments({ status: "pending" }),
      FacultyReview.countDocuments({}),
    ]);

    return {
      success: true as const,
      stats: {
        totalFaculty,
        activeFaculty,
        inactiveFaculty,
        totalUpvotes: (upvotesRaw[0]?.total as number | undefined) ?? 0,
        pendingReviews,
        totalReviews,
      },
    };
  } catch (error) {
    console.error("Admin faculty overview error:", error);

    return {
      success: false as const,
      message: "Failed to load faculty overview.",
    };
  }
}