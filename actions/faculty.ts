
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

import User from "@/models/user";
import Faculty from "@/models/Faculty";

import {
  createFacultySchema,
  updateFacultySchema,
} from "@/lib/validations/faculty";

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

// get faculty action

export async function getFacultyAction() {
  try {
    await connectDB();

    const faculty = await Faculty.find({})
      .sort({ name: 1 })
      .lean();

    return {
      success: true,
      faculty: JSON.parse(JSON.stringify(faculty)).map((member: any) => ({
        ...member,
        id: String(member._id),
        _id: String(member._id),
      })),
    };
  } catch (error) {
    console.error("Get faculty error:", error);

    return {
      success: false,
      faculty: [],
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

