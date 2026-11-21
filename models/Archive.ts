import mongoose, { Schema, Model } from "mongoose";

export interface IArchive {
  title: string; // generated: "3.3 - CSE - 60"
  semester: string; // "3.3"
  department: string; // "CSE"
  batch: string; // "60"
  description: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const archiveSchema = new Schema<IArchive>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// One archive per semester + department + batch.
// This index is the real guarantee against duplicates, even if two
// students press "Create" at the same moment.
archiveSchema.index(
  { semester: 1, department: 1, batch: 1 },
  { unique: true }
);

archiveSchema.index({ createdAt: -1 });

const Archive: Model<IArchive> =
  mongoose.models.Archive ||
  mongoose.model<IArchive>("Archive", archiveSchema);

export default Archive;
