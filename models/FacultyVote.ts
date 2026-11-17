
import mongoose from "mongoose";

const facultyVoteSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can vote only once per faculty
facultyVoteSchema.index(
  { facultyId: 1, userId: 1 },
  { unique: true }
);

const FacultyVote =
  mongoose.models.FacultyVote ||
  mongoose.model("FacultyVote", facultyVoteSchema);

export default FacultyVote;
