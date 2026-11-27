
"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import Resource from "@/models/Resource";
import QuestionPaper from "@/models/QuestionPaper";
import { getCurrentUserAction } from "@/actions/auth";

type BookmarkItemType = "Resource" | "QuestionPaper";

async function getStudentId() {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    return {
      success: false as const,
      message: "Please login to continue.",
    };
  }

  if (auth.user.role !== "student") {
    return {
      success: false as const,
      message: "Only students can bookmark items.",
    };
  }

  return {
    success: true as const,
    userId: auth.user.id,
  };
}

function isValidItemType(value: string): value is BookmarkItemType {
  return value === "Resource" || value === "QuestionPaper";
}

async function itemExists(itemId: string, itemType: BookmarkItemType) {
  if (itemType === "Resource") {
    return Boolean(await Resource.exists({ _id: itemId }));
  }

  return Boolean(await QuestionPaper.exists({ _id: itemId }));
}

// Toggle bookmark: save if not bookmarked, remove if already bookmarked.
export async function toggleBookmarkAction(
  itemId: string,
  itemType: BookmarkItemType
) {
  try {
    const student = await getStudentId();

    if (!student.success) {
      return { success: false, message: student.message };
    }

    if (!mongoose.Types.ObjectId.isValid(itemId) || !isValidItemType(itemType)) {
      return { success: false, message: "Invalid item." };
    }

    await connectDB();

    const exists = await itemExists(itemId, itemType);

    if (!exists) {
      return { success: false, message: "This item could not be found." };
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(student.userId),
      itemId: new mongoose.Types.ObjectId(itemId),
      itemType,
    };

    const existingBookmark = await Bookmark.findOne(filter);

    let hasBookmarked: boolean;

    if (existingBookmark) {
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      hasBookmarked = false;
    } else {
      await Bookmark.create(filter);
      hasBookmarked = true;
    }

    const bookmarkCount = await Bookmark.countDocuments({
      itemId: new mongoose.Types.ObjectId(itemId),
      itemType,
    });

    return {
      success: true,
      hasBookmarked,
      bookmarkCount,
      message: hasBookmarked
        ? "Added to bookmarks."
        : "Removed from bookmarks.",
    };
  } catch (error) {
    console.error("toggleBookmarkAction error:", error);

    return {
      success: false,
      message: "Something went wrong while updating the bookmark.",
    };
  }
}

// Get bookmark status and total count for one item.
export async function getBookmarkStatusAction(
  itemId: string,
  itemType: BookmarkItemType
) {
  try {
    const student = await getStudentId();

    if (!student.success) {
      return {
        success: false,
        message: student.message,
        hasBookmarked: false,
        bookmarkCount: 0,
      };
    }

    if (!mongoose.Types.ObjectId.isValid(itemId) || !isValidItemType(itemType)) {
      return {
        success: false,
        message: "Invalid item.",
        hasBookmarked: false,
        bookmarkCount: 0,
      };
    }

    await connectDB();

    const objectId = new mongoose.Types.ObjectId(itemId);

    const [bookmark, bookmarkCount] = await Promise.all([
      Bookmark.exists({
        userId: new mongoose.Types.ObjectId(student.userId),
        itemId: objectId,
        itemType,
      }),
      Bookmark.countDocuments({ itemId: objectId, itemType }),
    ]);

    return {
      success: true,
      hasBookmarked: Boolean(bookmark),
      bookmarkCount,
    };
  } catch (error) {
    console.error("getBookmarkStatusAction error:", error);

    return {
      success: false,
      hasBookmarked: false,
      bookmarkCount: 0,
    };
  }
}

// Batch status lookup for all cards currently displayed.

export async function getBookmarkStatusesAction(
  itemIds: string[],
  itemType: BookmarkItemType
) {
  try {
    if (!isValidItemType(itemType)) {
      return {
        success: false,
        message: "Invalid item type.",
        statuses: {} as Record<
          string,
          { hasBookmarked: boolean; bookmarkCount: number }
        >,
      };
    }

    const validIds = itemIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return {
        success: true,
        statuses: {} as Record<
          string,
          { hasBookmarked: boolean; bookmarkCount: number }
        >,
      };
    }

    await connectDB();

    // Only students have a personal bookmark status.
    // Everyone can see the total bookmark count.
    const auth = await getCurrentUserAction();

    const userId =
      auth.success && auth.user?.role === "student"
        ? new mongoose.Types.ObjectId(auth.user.id)
        : null;

    const objectIds = validIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const [myBookmarks, counts] = await Promise.all([
      userId
        ? Bookmark.find({
            userId,
            itemId: { $in: objectIds },
            itemType,
          })
            .select("itemId")
            .lean()
        : Promise.resolve([]),

      Bookmark.aggregate([
        {
          $match: {
            itemId: { $in: objectIds },
            itemType,
          },
        },
        {
          $group: {
            _id: "$itemId",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const bookmarkedIds = new Set(
      myBookmarks.map((bookmark) => bookmark.itemId.toString())
    );

    const countMap = new Map<string, number>(
      counts.map((entry) => [entry._id.toString(), entry.count])
    );

    const statuses: Record<
      string,
      { hasBookmarked: boolean; bookmarkCount: number }
    > = {};

    for (const id of validIds) {
      statuses[id] = {
        hasBookmarked: bookmarkedIds.has(id),
        bookmarkCount: countMap.get(id) ?? 0,
      };
    }

    return { success: true, statuses };
  } catch (error) {
    console.error("getBookmarkStatusesAction error:", error);

    return {
      success: false,
      message: "Could not load bookmark statuses.",
      statuses: {} as Record<
        string,
        { hasBookmarked: boolean; bookmarkCount: number }
      >,
    };
  }
}


// Get all bookmarks belonging to the currently logged-in student.
export async function getMyBookmarksAction() {
  try {
    const student = await getStudentId();

    if (!student.success) {
      return { success: false, message: student.message, bookmarks: [] };
    }

    await connectDB();

    const savedBookmarks = await Bookmark.find({
      userId: new mongoose.Types.ObjectId(student.userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const resourceIds = savedBookmarks
      .filter((bookmark) => bookmark.itemType === "Resource")
      .map((bookmark) => bookmark.itemId);

    const questionPaperIds = savedBookmarks
      .filter((bookmark) => bookmark.itemType === "QuestionPaper")
      .map((bookmark) => bookmark.itemId);

    const [resources, questionPapers] = await Promise.all([
      Resource.find({ _id: { $in: resourceIds } })
        .populate("uploadedBy", "name universityId")
        .lean(),

      QuestionPaper.find({ _id: { $in: questionPaperIds } })
        .populate("uploadedBy", "name universityId")
        .lean(),
    ]);

    const resourceMap = new Map(
      resources.map((item) => [item._id.toString(), item])
    );

    const questionPaperMap = new Map(
      questionPapers.map((item) => [item._id.toString(), item])
    );

    
    const bookmarks = savedBookmarks
        .map((bookmark) => {
        const itemId = bookmark.itemId.toString();

        const item =
             bookmark.itemType === "Resource"
        ? resourceMap.get(itemId)
        : questionPaperMap.get(itemId);

        if (!item) return null;

        // Explicitly handle the populated uploader
        const populatedItem = item as typeof item & {
            uploadedBy?: {
            _id: mongoose.Types.ObjectId;
            name: string;
            universityId: string;
        } | null;
    };

    return {
      bookmarkId: bookmark._id.toString(),
      itemType: bookmark.itemType,
      bookmarkedAt: bookmark.createdAt.toISOString(),
      item: {
        ...populatedItem,
        _id: item._id.toString(),
        uploadedBy: populatedItem.uploadedBy
          ? {
              _id: populatedItem.uploadedBy._id.toString(),
              name: populatedItem.uploadedBy.name,
              universityId: populatedItem.uploadedBy.universityId,
            }
          : null,
        createdAt: item.createdAt?.toISOString(),
        updatedAt: item.updatedAt?.toISOString(),
      },
    };
  })
  .filter(Boolean);


    return {
      success: true,
      bookmarks,
    };
  } catch (error) {
    console.error("getMyBookmarksAction error:", error);

    return {
      success: false,
      message: "Could not load your bookmarks.",
      bookmarks: [],
    };
  }
}
