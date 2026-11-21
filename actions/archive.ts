"use server";

import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import { getCurrentUserAction } from "@/actions/auth";
import { buildArchiveTitle } from "@/lib/archive";
import { createArchiveSchema } from "@/lib/validations/archive";

import Archive from "@/models/Archive";
import Resource from "@/models/Resource";
import User from "@/models/user";

// 1. Create an archive (one per semester + department + batch)
export async function createArchiveAction(data: unknown) {
  try {
    // Authenticate user
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
      return {
        success: false,
        message: "Please login to create an archive.",
      };
    }

    // Assumption: students and admins can create archives
    if (auth.user.role !== "student" && auth.user.role !== "admin") {
      return {
        success: false,
        message: "Only students can create archives.",
      };
    }

    // Validate input
    const validatedData = createArchiveSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message:
          validatedData.error.issues[0]?.message ||
          "Invalid archive information.",
      };
    }

    const { semester, department, batch, description } = validatedData.data;
    const title = buildArchiveTitle(semester, department, batch);

    await connectDB();

    // Friendly duplicate check (the unique index is the real guard)
    const existing = await Archive.exists({ semester, department, batch });

    if (existing) {
      return {
        success: false,
        message: `The archive "${title}" already exists.`,
      };
    }

    await Archive.create({
      title,
      semester,
      department,
      batch,
      description,
      createdBy: new mongoose.Types.ObjectId(auth.user.id),
    });

    revalidatePath("/archives");

    return {
      success: true,
      message: `Archive "${title}" created.`,
    };
  } catch (error: unknown) {
    // Two students created the same archive at the same moment
    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      return {
        success: false,
        message: "This archive already exists.",
      };
    }

    console.error("Create archive error:", error);

    return {
      success: false,
      message: "Something went wrong while creating the archive.",
    };
  }
}

// 2. Get all archives + overview stats
export async function getArchivesAction() {
  try {
    // Prevent this database operation from running during prerendering
    await connection();

    await connectDB();

    // Make sure the User model is registered for populate()
    void User;

    const [archives, resourceCounts, totalResources, contributors] =
      await Promise.all([
        Archive.find({})
          .sort({ createdAt: -1 })
          .populate("createdBy", "name")
          .lean(),

        Resource.aggregate([
          { $match: { archiveId: { $ne: null } } },
          { $group: { _id: "$archiveId", count: { $sum: 1 } } },
        ]),

        Resource.countDocuments({}),
        Resource.distinct("uploadedBy"),
      ]);

    const countByArchive = new Map<string, number>(
      resourceCounts.map((item) => [String(item._id), item.count as number])
    );

    return {
      success: true,
      archives: archives.map((archive) => {
        const creator = archive.createdBy as unknown as {
          name?: string;
        } | null;

        return {
          id: String(archive._id),
          title: archive.title,
          semester: archive.semester,
          department: archive.department,
          batch: archive.batch,
          description: archive.description ?? "",
          createdByName: creator?.name ?? "Unknown",
          resourceCount: countByArchive.get(String(archive._id)) ?? 0,
        };
      }),
      stats: {
        totalArchives: archives.length,
        contributors: contributors.length,
        resources: totalResources,
      },
    };
  } catch (error) {
    console.error("Get archives error:", error);

    return {
      success: false,
      archives: [],
      stats: { totalArchives: 0, contributors: 0, resources: 0 },
    };
  }
}
