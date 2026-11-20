
import mongoose, { Schema, Model } from "mongoose";

export interface IResourceLike {
  resourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceLikeSchema = new Schema<IResourceLike>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A student can like a resource only once
resourceLikeSchema.index(
  { resourceId: 1, userId: 1 },
  { unique: true }
);

const ResourceLike: Model<IResourceLike> =
  mongoose.models.ResourceLike ||
  mongoose.model<IResourceLike>("ResourceLike", resourceLikeSchema);

export default ResourceLike;
