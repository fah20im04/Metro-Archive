
"use server";

import connectDB from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";

import Resource from "@/models/Resource";
import QuestionPaper from "@/models/QuestionPaper";

import { createResourceSchema } from "@/lib/validations/resource";
import { questionPaperSchema } from "@/lib/validations/questionPaper";

import { deleteResourceAction } from "@/actions/resource";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

// --------------------------------------------------
// SHARED HELPERS
// --------------------------------------------------

async function verifyAdmin() {
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
      message: "You are not authorized to perform this action.",
    };
  }

  return {
    success: true,
    user: auth.user,
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function refreshAdminResourcePaths() {
  revalidatePath("/resources");
  revalidatePath("/question-bank");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin/resources");
}

// --------------------------------------------------
// 1. GET ALL RESOURCES (ADMIN)
// --------------------------------------------------

interface GetAdminResourcesParams {
  page?: number;
  limit?: number;
  search?: string;
  resourceType?: string;
  departmentCode?: string;
}

export async function getAdminResourcesAction({
  page = 1,
  limit = 10,
  search = "",
  resourceType = "",
  departmentCode = "",
}: GetAdminResourcesParams = {}) {
  try {
    const auth = await verifyAdmin();

    if (!auth.success) {
      return auth;
    }

    await connectDB();

    const currentPage = Math.max(1, page);
    const pageLimit = Math.min(100, Math.max(1, limit));

    const query: Record<string, unknown> = {};

    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      query.$or = [
        { resourceTitle: regex },
        { courseName: regex },
        { courseCode: regex },
        { departmentCode: regex },
      ];
    }

    if (resourceType) {
      query.resourceType = resourceType;
    }

    if (departmentCode) {
      query.departmentCode = departmentCode;
    }

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .populate("uploadedBy", "name universityId")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit)
        .lean(),

      Resource.countDocuments(query),
    ]);

    return {
      success: true,
      resources: JSON.parse(JSON.stringify(resources)),
      pagination: {
        currentPage,
        totalPages: Math.ceil(total / pageLimit),
        totalItems: total,
        limit: pageLimit,
      },
    };
  } catch (error) {
    console.error("getAdminResourcesAction error:", error);

    return {
      success: false,
      message: "Failed to fetch resources.",
    };
  }
}

// --------------------------------------------------
// 2. UPDATE ANY RESOURCE (ADMIN)
// --------------------------------------------------

export async function updateAdminResourceAction(
  resourceId: string,
  data: unknown
) {
  try {
    const auth = await verifyAdmin();

    if (!auth.success) {
      return auth;
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return {
        success: false,
        message: "Invalid resource ID.",
      };
    }

    // Validate using the existing resource schema
    const validation = createResourceSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Invalid resource data.",
      };
    }

    await connectDB();

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      {
        $set: validation.data,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("uploadedBy", "name universityId")
      .lean();

    if (!updatedResource) {
      return {
        success: false,
        message: "Resource not found.",
      };
    }

    refreshAdminResourcePaths();

    return {
      success: true,
      message: "Resource updated successfully.",
      resource: JSON.parse(JSON.stringify(updatedResource)),
    };
  } catch (error) {
    console.error("updateAdminResourceAction error:", error);

    return {
      success: false,
      message: "Failed to update resource.",
    };
  }
}

// --------------------------------------------------
// 3. DELETE ANY RESOURCE (ADMIN)
// Reuses your existing delete action.
// --------------------------------------------------

export async function deleteAdminResourceAction(resourceId: string) {
  try {
    const auth = await verifyAdmin();

    if (!auth.success) {
      return auth;
    }

    const result = await deleteResourceAction(resourceId);

    if (result.success) {
      refreshAdminResourcePaths();
    }

    return result;
  } catch (error) {
    console.error("deleteAdminResourceAction error:", error);

    return {
      success: false,
      message: "Failed to delete resource.",
    };
  }
}

// --------------------------------------------------
// 4. GET ALL QUESTION PAPERS (ADMIN)
// --------------------------------------------------

interface GetAdminQuestionPapersParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentName?: string;
  semester?: string;
  batch?: string;
  examType?: string;
  section?: string;
}

export async function getAdminQuestionPapersAction({
  page = 1,
  limit = 10,
  search = "",
  departmentName = "",
  semester = "",
  batch = "",
  examType = "",
  section = "",
}: GetAdminQuestionPapersParams = {}) {
  try {
    const auth = await verifyAdmin();

    if (!auth.success) {
      return auth;
    }

    await connectDB();

    const currentPage = Math.max(1, page);
    const pageLimit = Math.min(100, Math.max(1, limit));

    const query: Record<string, unknown> = {};

    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      query.$or = [
        { title: regex },
        { courseName: regex },
        { departmentName: regex },
        { batch: regex },
        { examType: regex },
      ];
    }

    if (departmentName) query.departmentName = departmentName;
    if (semester) query.semester = semester;
    if (batch) query.batch = batch;
    if (examType) query.examType = examType;
    if (section) query.section = section;

    const [papers, total] = await Promise.all([
      QuestionPaper.find(query)
        .populate("uploadedBy", "name universityId")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit)
        .lean(),

      QuestionPaper.countDocuments(query),
    ]);

    return {
      success: true,
      papers: JSON.parse(JSON.stringify(papers)),
      pagination: {
        currentPage,
        totalPages: Math.ceil(total / pageLimit),
        totalItems: total,
        limit: pageLimit,
      },
    };
  } catch (error) {
    console.error("getAdminQuestionPapersAction error:", error);

    return {
      success: false,
      message: "Failed to fetch question papers.",
    };
  }
}

// --------------------------------------------------
// 5. UPDATE ANY QUESTION PAPER (ADMIN)
// --------------------------------------------------

export async function updateAdminQuestionPaperAction(
  paperId: string,
  data: unknown
) {
  try {
    const auth = await verifyAdmin();

    if (!auth.success) {
      return auth;
    }

    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return {
        success: false,
        message: "Invalid question paper ID.",
      };
    }

    // Validate all fields using your existing schema
    const validation = questionPaperSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Invalid question paper data.",
      };
    }

    await connectDB();

    const paperData = { ...validation.data };

    // Remove section when it is empty
    if (!paperData.section) {
      delete paperData.section;
    }

    // Check for duplicates before updating.
    // Quiz papers include section in their uniqueness rule.
    const duplicateQuery =
      paperData.examType === "Quiz"
        ? {
            courseName: paperData.courseName,
            batch: paperData.batch,
            semester: paperData.semester,
            section: paperData.section,
            examType: "Quiz",
          }
        : {
            courseName: paperData.courseName,
            batch: paperData.batch,
            semester: paperData.semester,
            examType: paperData.examType,
          };

    const duplicate = await QuestionPaper.findOne({
      ...duplicateQuery,
      _id: { $ne: paperId },
    }).collation({
      locale: "en",
      strength: 2,
    });

    if (duplicate) {
      return {
        success: false,
        message: "A question paper with these details already exists.",
      };
    }

    const updatedPaper = await QuestionPaper.findByIdAndUpdate(
      paperId,
      {
        $set: paperData,
        ...(paperData.examType !== "Quiz"
          ? { $unset: { section: 1 } }
          : {}),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("uploadedBy", "name universityId")
      .lean();

    if (!updatedPaper) {
      return {
        success: false,
        message: "Question paper not found.",
      };
    }

    refreshAdminResourcePaths();

    return {
      success: true,
      message: "Question paper updated successfully.",
      paper: JSON.parse(JSON.stringify(updatedPaper)),
    };
  } catch (error) {
    console.error("updateAdminQuestionPaperAction error:", error);

    return {
      success: false,
      message: "Failed to update question paper.",
    };
  }
}

// --------------------------------------------------
// 6. DELETE ANY QUESTION PAPER (ADMIN)
// --------------------------------------------------

export async function deleteAdminQuestionPaperAction(paperId: string) {
  try {
    const auth = await verifyAdmin();

    if (!auth.success) {
      return auth;
    }

    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return {
        success: false,
        message: "Invalid question paper ID.",
      };
    }

    await connectDB();

    const deletedPaper = await QuestionPaper.findByIdAndDelete(paperId);

    if (!deletedPaper) {
      return {
        success: false,
        message: "Question paper not found.",
      };
    }

    refreshAdminResourcePaths();

    return {
      success: true,
      message: "Question paper deleted successfully.",
    };
  } catch (error) {
    console.error("deleteAdminQuestionPaperAction error:", error);

    return {
      success: false,
      message: "Failed to delete question paper.",
    };
  }
}
