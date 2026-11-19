
import mongoose, { Schema, Types, Model } from "mongoose";

export type UserRole = "student" | "faculty" | "admin";

export type AccountStatus = "pending" | "active" | "suspended";

export interface IUser {
  name: string;
  universityId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  departmentName: string | null;
  batch: string | null;
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    universityId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
      required: true,
    },

    departmentName: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    batch: {
      type: String,
      trim: true,
      default: null,
    },

    accountStatus: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const user: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default user;
