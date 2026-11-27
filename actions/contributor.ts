
"use server";

import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import User from "@/models/user";
import Bookmark from "@/models/Bookmark";

export async function getTopContributorsAction() {
  try {
    await connectDB();

    const contributors = await Resource.aggregate([
      // Group resources by their uploader
      {
        $group: {
          _id: "$uploadedBy",
          contributionCount: { $sum: 1 },
          totalLikes: { $sum: { $ifNull: ["$likeCount", 0] } },
          resourceIds: { $push: "$_id" },
        },
      },

      // Only include students
      {
        $lookup: {
          from: User.collection.name,
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$studentId"] },
                role: "student",
              },
            },
            {
              $project: {
                name: 1,
                departmentName: 1,
                batch: 1,
              },
            },
          ],
          as: "student",
        },
      },

      { $unwind: "$student" },

      // Count bookmarks received by this student's resources
      {
        $lookup: {
          from: Bookmark.collection.name,
          let: { ids: "$resourceIds" },
          pipeline: [
            {
              $match: {
                itemType: "Resource",
                $expr: {
                  $in: ["$itemId", "$$ids"],
                },
              },
            },
            { $count: "count" },
          ],
          as: "bookmarkStats",
        },
      },

      {
        $addFields: {
          totalBookmarks: {
            $ifNull: [
              { $arrayElemAt: ["$bookmarkStats.count", 0] },
              0,
            ],
          },
        },
      },

      // Calculate engagement score
      {
        $addFields: {
          engagementScore: {
            $add: ["$totalLikes", "$totalBookmarks"],
          },
        },
      },

      // Highest engagement first, then contribution count
      {
        $sort: {
          engagementScore: -1,
          contributionCount: -1,
          "student.name": 1,
        },
      },

      { $limit: 3 },

      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          name: "$student.name",
          department: {
            $ifNull: ["$student.departmentName", "N/A"],
          },
          batch: {
            $ifNull: ["$student.batch", "N/A"],
          },
          contributionCount: 1,
          likes: "$totalLikes",
          bookmarks: "$totalBookmarks",
          engagementScore: 1,
        },
      },
    ]);

    return {
      success: true,
      contributors: JSON.parse(JSON.stringify(contributors)),
    };
  } catch (error) {
    console.error("Get top contributors error:", error);

    return {
      success: false,
      contributors: [],
      message: "Failed to fetch top contributors.",
    };
  }
}
