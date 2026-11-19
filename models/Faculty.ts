
import mongoose, { Schema, Model } from "mongoose";

export interface IFaculty {
  sourceId: number;
  name: string;
  departmentNames: string[];
  courseIds: number[];
  designation: string;
  profileImage: string | null;
  profileStatus: "pending" | "active" | "inactive";
  createdAt: Date;
  updatedAt: Date | null;
  upvoteCount: number;
}

const facultySchema = new Schema<IFaculty>(
  {
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

    departmentNames: {
      type: [String],
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

    // Important: This must exist in the Mongoose schema
    upvoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Faculty: Model<IFaculty> =
  mongoose.models.Faculty ||
  mongoose.model<IFaculty>("Faculty", facultySchema);

export default Faculty;
