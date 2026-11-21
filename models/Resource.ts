
import mongoose, { Schema, Model } from "mongoose";

export interface IResource {
  courseName: string;
  courseCode: string;
  departmentCode: string;
  resourceTitle: string;
  resourceType:
    | "Notes"
    | "Lab Report"
    | "Assignment"
    | "Question Paper"
    | "Other";
  driveUrl: string;
  uploadedBy: mongoose.Types.ObjectId;
  archiveId?: mongoose.Types.ObjectId | null;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    departmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    resourceTitle: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: [
        "Notes",
        "Lab Report",
        "Assignment",
        "Question Paper",
        "Other",
      ],
      required: true,
    },
    driveUrl: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Which archive this resource belongs to (optional for older resources)
    archiveId: {
      type: Schema.Types.ObjectId,
      ref: "Archive",
      default: null,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Resource browsing indexes
resourceSchema.index({ courseCode: 1, createdAt: -1 });
resourceSchema.index({ departmentCode: 1, createdAt: -1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ archiveId: 1, createdAt: -1 });

const Resource: Model<IResource> =
  mongoose.models.Resource ||
  mongoose.model<IResource>("Resource", resourceSchema);

export default Resource;
