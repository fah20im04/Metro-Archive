
import mongoose, { Schema, Types, Model } from "mongoose";

export interface IFaculty {
  sourceId: number;
  name: string;
  departmentIds: number[];
  courseIds: number[];
  designation: string;
  profileImage: string | null;
  profileStatus: "pending" | "active" | "inactive";
  createdAt: Date;
  updatedAt: Date | null;
}

const facultySchema = new Schema<IFaculty>(
  {
    // Original ID from the university dataset
    sourceId: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Preserve the university's original numeric IDs
    departmentIds: {
      type: [Number],
      default: [],
    },

    courseIds: {
      type: [Number],
      default: [],
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    profileStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during Next.js development
const Faculty: Model<IFaculty> =
  mongoose.models.Faculty ||
  mongoose.model<IFaculty>("Faculty", facultySchema);

export default Faculty;
