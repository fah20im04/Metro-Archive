
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";

import connectDB from "@/lib/mongodb";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import mongoose, { type ClientSession } from "mongoose";

import User from "@/models/user";
import Faculty from "@/models/Faculty";

import {
  createFacultySchema,
  updateFacultySchema,
} from "@/lib/validations/faculty";
import { getCurrentUserAction } from "./auth";
import FacultyVote from "@/models/FacultyVote";

// Check whether the current user is an active admin
export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session?.userId) {
    return null;
  }

  await connectDB();

  const user = await User.findById(session.userId)
    .select("role accountStatus")
    .lean();

  if (!user || user.role !== "admin" || user.accountStatus !== "active") {
    return null;
  }

  return user;
}

// get faculty by id

export async function getFacultyById(id: string) {
  try {
    // Run dynamic database access inside the Suspense boundary
    await connection();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    await connectDB();

    const faculty = await Faculty.findById(id).lean();

    if (!faculty) {
      return null;
    }

    return JSON.parse(JSON.stringify(faculty));
  } catch (error) {
    console.error("Get faculty by ID error:", error);
    return null;
  }
}

// get faculty action



export async function getFacultyAction() {
  try {
    // Prevent this database operation from running during prerendering
    await connection();

    await connectDB();

    const faculty = await Faculty.find({})
      .sort({ name: 1 })
      .lean();

    return {
      success: true,
      faculty: JSON.parse(JSON.stringify(faculty)).map(
        (member: any) => ({
          ...member,
          id: String(member._id),
          _id: String(member._id),
        })
      ),
    };
  } catch (error) {
    console.error("Get faculty error:", error);

    return {
      success: false,
      faculty: [],
    };
  }
}





export async function voteFacultyAction(facultyId: string) {
  let session: ClientSession | null = null;

  try {
    // 1. Authenticate user
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to vote.",
        upvoteCount: 0,
      };
    }

    // 2. Only students can vote
    if (auth.user.role !== "student") {
      return {
        success: false,
        message: "Only students can vote.",
        upvoteCount: 0,
      };
    }

    // 3. Validate faculty ID
    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return {
        success: false,
        message: "Invalid faculty ID.",
        upvoteCount: 0,
      };
    }

    await connectDB();

    session = await mongoose.startSession();

    let response = {
      success: false,
      message: "Voting failed.",
      upvoteCount: 0,
    };

    // 4. Perform both operations in one transaction
    await session.withTransaction(async () => {
      // Check whether the student has already voted
      const existingVote = await FacultyVote.findOne({
        facultyId,
        userId: auth.user.id,
      }).session(session!);

      if (existingVote) {
        response = {
          success: false,
          message: "You have already voted for this faculty.",
          upvoteCount: 0,
        };
        return;
      }

      // Check whether faculty exists
      const faculty = await Faculty.findById(facultyId).session(session!);

      if (!faculty) {
        response = {
          success: false,
          message: "Faculty not found.",
          upvoteCount: 0,
        };
        return;
      }

      // 5. Create vote record
      await FacultyVote.create(
        [
          {
            facultyId,
            userId: auth.user.id,
          },
        ],
        { session: session! }
      );

      // 6. Increment the faculty document's upvoteCount
      const updatedFaculty = await Faculty.findByIdAndUpdate(
        facultyId,
        {
          $inc: { upvoteCount: 1 },
        },
        {
          new: true,
          session: session!,
        }
      );

      // Make sure the faculty document was actually updated
      if (!updatedFaculty) {
        throw new Error("Faculty upvote count could not be updated.");
      }

      // 7. Return the actual updated count
      response = {
        success: true,
        message: "Your vote has been recorded successfully.",
        upvoteCount: updatedFaculty.upvoteCount,
      };
    });

    return response;
  } catch (error: any) {
    console.error("Faculty voting error:", error);

    if (error.code === 11000) {
      return {
        success: false,
        message: "You have already voted for this faculty.",
        upvoteCount: 0,
      };
    }

    return {
      success: false,
      message: error.message || "Something went wrong while voting.",
      upvoteCount: 0,
    };
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}


export async function getFacultyVoteStatusAction(facultyId: string) {
  try {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: true,
        hasVoted: false,
        isLoggedIn: false,
      };
    }

    await connectDB();

    const vote = await FacultyVote.findOne({
      facultyId,
      userId: auth.user.id,
    }).lean();

    return {
      success: true,
      hasVoted: !!vote,
      isLoggedIn: true,
    };
  } catch (error) {
    console.error("Vote status error:", error);

    return {
      success: false,
      hasVoted: false,
      isLoggedIn: false,
    };
  }
}



// CREATE FACULTY
export async function createFacultyAction(data: unknown) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return {
        success: false,
        message: "Unauthorized. Admin access is required.",
      };
    }

    const validation = createFacultySchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Please check the faculty information.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const existingFaculty = await Faculty.findOne({
      sourceId: validation.data.sourceId,
    });

    if (existingFaculty) {
      return {
        success: false,
        message: "A faculty profile with this university ID already exists.",
      };
    }

    const faculty = await Faculty.create(validation.data);

    revalidatePath("/faculty");

    return {
      success: true,
      message: "Faculty profile created successfully.",
      facultyId: faculty._id.toString(),
    };
  } catch (error) {
    console.error("Create faculty error:", error);

    return {
      success: false,
      message: "Failed to create faculty profile.",
    };
  }
}

// UPDATE FACULTY
export async function updateFacultyAction(
  id: string,
  data: unknown
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return {
        success: false,
        message: "Unauthorized. Admin access is required.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid faculty ID.",
      };
    }

    const validation = updateFacultySchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Please check the faculty information.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    if (Object.keys(validation.data).length === 0) {
      return {
        success: false,
        message: "No changes were provided.",
      };
    }

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      { $set: validation.data },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!faculty) {
      return {
        success: false,
        message: "Faculty profile not found.",
      };
    }

    revalidatePath("/faculty");

    return {
      success: true,
      message: "Faculty profile updated successfully.",
    };
  } catch (error) {
    console.error("Update faculty error:", error);

    return {
      success: false,
      message: "Failed to update faculty profile.",
    };
  }
}

// DELETE FACULTY
export async function deleteFacultyAction(id: string) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return {
        success: false,
        message: "Unauthorized. Admin access is required.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid faculty ID.",
      };
    }

    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      return {
        success: false,
        message: "Faculty profile not found.",
      };
    }

    revalidatePath("/faculty");

    return {
      success: true,
      message: "Faculty profile deleted successfully.",
    };
  } catch (error) {
    console.error("Delete faculty error:", error);

    return {
      success: false,
      message: "Failed to delete faculty profile.",
    };
  }
}

