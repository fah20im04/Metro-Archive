
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  itemType: "Resource" | "QuestionPaper";
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    itemType: {
      type: String,
      enum: ["Resource", "QuestionPaper"],
      required: true,
    },
  },
  { timestamps: true }
);

// A student can bookmark the same item only once.
BookmarkSchema.index(
  { userId: 1, itemId: 1, itemType: 1 },
  { unique: true }
);

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark ||
  mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;
