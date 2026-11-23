
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestionPaper extends Document {
  title: string;
  courseName: string;
  departmentName: string;
  semester: string;
  batch: string;
  section?: string;
  examType: "Midterm" | "Final" | "Quiz" | "Other";
  uploadedBy: mongoose.Types.ObjectId;
  driveUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionPaperSchema = new Schema<IQuestionPaper>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
      match: /^\d+\.\d+$/,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      required: function () {
        return this.examType === "Quiz";
      },
    },
    examType: {
      type: String,
      enum: ["Midterm", "Final", "Quiz", "Other"],
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driveUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Quiz: one paper per course, batch, semester, and section
QuestionPaperSchema.index(
  { courseName: 1, batch: 1, semester: 1, section: 1 },
  {
    unique: true,
    name: "unique_quiz_per_section",
    partialFilterExpression: { examType: "Quiz" },
    collation: { locale: "en", strength: 2 },
  }
);

// Midterm, Final, Other: one paper per course, batch, semester, and exam type
QuestionPaperSchema.index(
  { courseName: 1, batch: 1, semester: 1, examType: 1 },
  {
    unique: true,
    name: "unique_non_quiz_paper",
    partialFilterExpression: {
      examType: { $in: ["Midterm", "Final", "Other"] },
    },
    collation: { locale: "en", strength: 2 },
  }
);

const QuestionPaper: Model<IQuestionPaper> =
  mongoose.models.QuestionPaper ||
  mongoose.model<IQuestionPaper>("QuestionPaper", QuestionPaperSchema);

export default QuestionPaper;
