
"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";

import Resource from "@/models/Resource";
import ResourceLike from "@/models/ResourceLike";

import { createResourceSchema } from "@/lib/validations/resource";

// Helper: check whether an ID is a valid MongoDB ObjectId
function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper: refresh relevant pages
function refreshResourcePaths() {
  revalidatePath("/resources");
  revalidatePath("/dashboard");
}

// --------------------------------------------------
// 1. CREATE RESOURCE
// Only authenticated students can upload
// --------------------------------------------------

export async function createResourceAction(data: unknown) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    if (auth.user.role !== "student") {
      return {
        success: false,
        message: "Only students can upload resources.",
      };
    }

    const validatedData = createResourceSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please check your information.",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    await connectDB();

    const resource = await Resource.create({
      ...validatedData.data,
      courseCode: validatedData.data.courseCode.toUpperCase(),
      departmentCode: validatedData.data.departmentCode.toUpperCase(),
      uploadedBy: auth.user.id,
      likeCount: 0,
    });

    refreshResourcePaths();

    return {
      success: true,
      message: "Resource uploaded successfully.",
      resourceId: resource._id.toString(),
    };
  } catch (error) {
    console.error("Create resource error:", error);

    return {
      success: false,
      message: "Something went wrong while uploading the resource.",
    };
  }
}

// --------------------------------------------------
// 2. GET ALL RESOURCES
// Supports searching and filtering
// --------------------------------------------------

interface ResourceFilters {
  search?: string;
  courseCode?: string;
  departmentCode?: string;
  resourceType?: string;
}

export async function getResourcesAction(
  filters: ResourceFilters = {}
) {
  try {
    await connectDB();

    const query: Record<string, any> = {};

    if (filters.courseCode) {
      query.courseCode = filters.courseCode.trim().toUpperCase();
    }

    if (filters.departmentCode) {
      query.departmentCode = filters.departmentCode.trim().toUpperCase();
    }

    if (filters.resourceType) {
      query.resourceType = filters.resourceType;
    }

    if (filters.search?.trim()) {
      const search = filters.search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      query.$or = [
        { courseName: { $regex: search, $options: "i" } },
        { courseCode: { $regex: search, $options: "i" } },
        { resourceTitle: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(query)
      .populate("uploadedBy", "name universityId")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      resources: JSON.parse(JSON.stringify(resources)),
    };
  } catch (error) {
    console.error("Get resources error:", error);

    return {
      success: false,
      resources: [],
      message: "Failed to fetch resources.",
    };
  }
}

// --------------------------------------------------
// 3. GET RESOURCE BY ID
// --------------------------------------------------

export async function getResourceByIdAction(id: string) {
  try {
    if (!isValidId(id)) {
      return null;
    }

    await connectDB();

    const resource = await Resource.findById(id)
      .populate("uploadedBy", "name universityId")
      .lean();

    if (!resource) {
      return null;
    }

    return JSON.parse(JSON.stringify(resource));
  } catch (error) {
    console.error("Get resource by ID error:", error);
    return null;
  }
}

// --------------------------------------------------
// 4. GET MY RESOURCES
// Fetch resources uploaded by logged-in student
// --------------------------------------------------

export async function getMyResourcesAction() {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        resources: [],
        message: "Please login first.",
      };
    }

    await connectDB();

    const resources = await Resource.find({
      uploadedBy: auth.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      resources: JSON.parse(JSON.stringify(resources)),
    };
  } catch (error) {
    console.error("Get my resources error:", error);

    return {
      success: false,
      resources: [],
      message: "Failed to fetch your resources.",
    };
  }
}

// --------------------------------------------------
// 5. UPDATE RESOURCE
// Only the uploader can update their resource
// --------------------------------------------------

export async function updateResourceAction(
  id: string,
  data: unknown
) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    if (auth.user.role !== "student") {
      return {
        success: false,
        message: "Only students can update resources.",
      };
    }

    if (!isValidId(id)) {
      return {
        success: false,
        message: "Invalid resource ID.",
      };
    }

    const validatedData = createResourceSchema
      .partial()
      .safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please check your information.",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const updateData = validatedData.data;

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: "No changes were provided.",
      };
    }

    await connectDB();

    const resource = await Resource.findOne({
      _id: id,
      uploadedBy: auth.user.id,
    });

    if (!resource) {
      return {
        success: false,
        message: "Resource not found or you don't own it.",
      };
    }

    Object.assign(resource, {
      ...updateData,
      ...(updateData.courseCode && {
        courseCode: updateData.courseCode.toUpperCase(),
      }),
      ...(updateData.departmentCode && {
        departmentCode: updateData.departmentCode.toUpperCase(),
      }),
    });

    await resource.save();

    refreshResourcePaths();
    revalidatePath(`/resources/${id}`);

    return {
      success: true,
      message: "Resource updated successfully.",
    };
  } catch (error) {
    console.error("Update resource error:", error);

    return {
      success: false,
      message: "Failed to update resource.",
    };
  }
}

// --------------------------------------------------
// 6. DELETE RESOURCE
// Owner or admin can delete
// Also removes associated likes
// --------------------------------------------------

export async function deleteResourceAction(id: string) {
  let session: mongoose.ClientSession | null = null;

  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    if (!isValidId(id)) {
      return {
        success: false,
        message: "Invalid resource ID.",
      };
    }

    await connectDB();

    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const resource = await Resource.findById(id).session(session!);

      if (!resource) {
        throw new Error("RESOURCE_NOT_FOUND");
      }

      const isOwner =
        resource.uploadedBy.toString() === auth.user!.id;

      const isAdmin = auth.user!.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new Error("NOT_AUTHORIZED");
      }

      await ResourceLike.deleteMany(
        { resourceId: id },
        { session: session! }
      );

      await Resource.deleteOne(
        { _id: id },
        { session: session! }
      );
    });

    refreshResourcePaths();

    return {
      success: true,
      message: "Resource deleted successfully.",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        return {
          success: false,
          message: "Resource not found.",
        };
      }

      if (error.message === "NOT_AUTHORIZED") {
        return {
          success: false,
          message: "You are not allowed to delete this resource.",
        };
      }
    }

    console.error("Delete resource error:", error);

    return {
      success: false,
      message: "Failed to delete resource.",
    };
  } finally {
    await session?.endSession();
  }
}

// --------------------------------------------------
// 7. TOGGLE RESOURCE LIKE
// Like if not liked; unlike if already liked
// --------------------------------------------------

export async function toggleResourceLikeAction(
  resourceId: string
) {
  let session: mongoose.ClientSession | null = null;

  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to like resources.",
      };
    }

    if (auth.user.role !== "student") {
      return {
        success: false,
        message: "Only students can like resources.",
      };
    }

    if (!isValidId(resourceId)) {
      return {
        success: false,
        message: "Invalid resource ID.",
      };
    }

    await connectDB();

    session = await mongoose.startSession();

    let result: {
      hasLiked: boolean;
      likeCount: number;
    } | null = null;

    await session.withTransaction(async () => {
      const resource = await Resource.findById(resourceId)
        .session(session!);

      if (!resource) {
        throw new Error("RESOURCE_NOT_FOUND");
      }

      const existingLike = await ResourceLike.findOne({
        resourceId,
        userId: auth.user!.id,
      }).session(session!);

      if (existingLike) {
        await ResourceLike.deleteOne(
          { _id: existingLike._id },
          { session: session! }
        );

        resource.likeCount = Math.max(0, resource.likeCount - 1);
        await resource.save({ session });

        result = {
          hasLiked: false,
          likeCount: resource.likeCount,
        };
      } else {
        await ResourceLike.create(
          [
            {
              resourceId,
              userId: auth.user!.id,
            },
          ],
          { session }
        );

        resource.likeCount += 1;
        await resource.save({ session });

        result = {
          hasLiked: true,
          likeCount: resource.likeCount,
        };
      }
    });

    refreshResourcePaths();
    revalidatePath(`/resources/${resourceId}`);

    return {
      success: true,
      message: result!.hasLiked
        ? "Resource liked."
        : "Like removed.",
      ...result!,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "RESOURCE_NOT_FOUND") {
      return {
        success: false,
        message: "Resource not found.",
      };
    }

    console.error("Toggle resource like error:", error);

    return {
      success: false,
      message: "Failed to update like. Please try again.",
    };
  } finally {
    await session?.endSession();
  }
}

// --------------------------------------------------
// 8. GET RESOURCE LIKE STATUS
// --------------------------------------------------

export async function getResourceLikeStatusAction(
  resourceId: string
) {
  try {
    if (!isValidId(resourceId)) {
      return {
        success: false,
        hasLiked: false,
        isLoggedIn: false,
      };
    }

    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: true,
        hasLiked: false,
        isLoggedIn: false,
      };
    }

    await connectDB();

    const like = await ResourceLike.exists({
      resourceId,
      userId: auth.user.id,
    });

    return {
      success: true,
      hasLiked: !!like,
      isLoggedIn: true,
    };
  } catch (error) {
    console.error("Get resource like status error:", error);

    return {
      success: false,
      hasLiked: false,
      isLoggedIn: false,
    };
  }
}
