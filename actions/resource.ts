
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

interface CreateNoteInput {
  courseName: string;
  courseCode: string;
  departmentCode: string;
  resourceTitle: string;
  resourceType: "Notes";
  driveUrl: string;
}

export async function createNoteAction(data: CreateNoteInput) {
  try {
    // 1. Authenticate user
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to upload notes.",
      };
    }

    // 2. Only students can upload notes
    if (auth.user.role !== "student") {
      return {
        success: false,
        message: "Only students can upload notes.",
      };
    }

    // 3. Validate user ID
    if (!mongoose.Types.ObjectId.isValid(auth.user.id)) {
      return {
        success: false,
        message: "Invalid user information.",
      };
    }

    // 4. Validate required fields
    const {
      courseName,
      courseCode,
      departmentCode,
      resourceTitle,
      driveUrl,
    } = data;

    if (
      !courseName?.trim() ||
      !courseCode?.trim() ||
      !departmentCode?.trim() ||
      !resourceTitle?.trim() ||
      !driveUrl?.trim()
    ) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    // 5. Validate URL
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(driveUrl);
    } catch {
      return {
        success: false,
        message: "Please provide a valid document URL.",
      };
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return {
        success: false,
        message: "Invalid document URL.",
      };
    }

    // 6. Connect to database
    await connectDB();

    // 7. Create resource
    const resource = await Resource.create({
      courseName: courseName.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      departmentCode: departmentCode.trim().toUpperCase(),
      resourceTitle: resourceTitle.trim(),
      resourceType: "Notes",
      driveUrl: parsedUrl.toString(),
      uploadedBy: new mongoose.Types.ObjectId(auth.user.id),
    });

    // 8. Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/student");
    revalidatePath("/resources");

    return {
      success: true,
      message: "Notes uploaded successfully.",
      resourceId: resource._id.toString(),
    };
  } catch (error) {
    console.error("Create note error:", error);

    return {
      success: false,
      message: "Failed to upload notes. Please try again.",
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

// Toggle resource like

export async function toggleResourceLikeAction(
  resourceId: string
): Promise<
  | {
      success: true;
      message: string;
      hasLiked: boolean;
      likeCount: number;
    }
  | {
      success: false;
      message: string;
    }
> {
  let session: mongoose.ClientSession | null = null;

  try {
    // 1. Authenticate user
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to like resources.",
      };
    }

    // 2. Only students can like resources
    if (auth.user.role !== "student") {
      return {
        success: false,
        message: "Only students can like resources.",
      };
    }

    // 3. Validate resource ID
    if (
      !mongoose.Types.ObjectId.isValid(resourceId) ||
      !mongoose.Types.ObjectId.isValid(auth.user.id)
    ) {
      return {
        success: false,
        message: "Invalid resource or user ID.",
      };
    }

    await connectDB();

    const resourceObjectId = new mongoose.Types.ObjectId(resourceId);
    const userObjectId = new mongoose.Types.ObjectId(auth.user.id);

    session = await mongoose.startSession();

    // 4. Execute transaction and return its result directly
    const result = await session.withTransaction(async () => {
      const resource = await Resource.findById(resourceObjectId).session(
        session!
      );

      if (!resource) {
        throw new Error("RESOURCE_NOT_FOUND");
      }

      const existingLike = await ResourceLike.findOne({
        resourceId: resourceObjectId,
        userId: userObjectId,
      }).session(session!);

      if (existingLike) {
        // Unlike
        await ResourceLike.deleteOne({
          _id: existingLike._id,
        }).session(session!);

        resource.likeCount = Math.max(0, resource.likeCount - 1);

        await resource.save({ session });

        return {
          hasLiked: false,
          likeCount: resource.likeCount,
        };
      }

      // Like
      await ResourceLike.create(
        [
          {
            resourceId: resourceObjectId,
            userId: userObjectId,
          },
        ],
        { session }
      );

      resource.likeCount += 1;

      await resource.save({ session });

      return {
        hasLiked: true,
        likeCount: resource.likeCount,
      };
    });

    // 5. Check transaction result
    if (!result) {
      return {
        success: false,
        message: "Failed to update like.",
      };
    }

    // 6. Revalidate pages
    revalidatePath("/resources");
    revalidatePath("/dashboard");
    revalidatePath(`/resources/${resourceId}`);

    // 7. Return success
    return {
      success: true,
      message: result.hasLiked
        ? "Resource liked."
        : "Like removed.",
      hasLiked: result.hasLiked,
      likeCount: result.likeCount,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "RESOURCE_NOT_FOUND"
    ) {
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

// Get resource like status
export async function getResourceLikeStatusAction(resourceId: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
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

    if (auth.user.role !== "student") {
      return {
        success: true,
        hasLiked: false,
        isLoggedIn: true,
      };
    }

    await connectDB();

    const userObjectId = new mongoose.Types.ObjectId(auth.user.id);
    const resourceObjectId = new mongoose.Types.ObjectId(resourceId);

    const like = await ResourceLike.exists({
      resourceId: resourceObjectId,
      userId: userObjectId,
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
