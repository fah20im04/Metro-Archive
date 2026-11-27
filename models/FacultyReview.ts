
import mongoose, { Schema, Model } from "mongoose";

export interface IFacultyReview {
  facultyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const facultyReviewSchema = new Schema<IFacultyReview>(
  {
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent one student from reviewing the same faculty member multiple times
facultyReviewSchema.index(
  { facultyId: 1, userId: 1 },
  { unique: true }
);

// Find reviews written by a particular student
facultyReviewSchema.index({
  userId: 1,
  createdAt: -1,
});

// Efficiently fetch approved reviews for a faculty member
facultyReviewSchema.index({
  facultyId: 1,
  status: 1,
  createdAt: -1,
});

const FacultyReview: Model<IFacultyReview> =
  mongoose.models.FacultyReview ||
  mongoose.model<IFacultyReview>("FacultyReview", facultyReviewSchema);

export default FacultyReview;
