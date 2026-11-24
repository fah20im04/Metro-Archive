"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Calendar,
  FileQuestion,
  FileText,
  GraduationCap,
  Plus,
} from "lucide-react";

import { toast } from "sonner";
import { createQuestionPaperAction } from "@/actions/questionPaper";

import CreateQuestionPaperModal, {
  type CreateQuestionPaperData,
} from "@/app/Components/Dashboard/questionBank/CreateQuestionPaperModal";

interface MyQuestion {
  _id: string;
  title: string;
  courseName: string;
  departmentName: string;
  semester: string;
  batch: string;
  section?: string;
  examType: string;
  driveUrl: string;
  createdAt?: string;
  uploadedBy?: {
    name: string;
    universityId: string;
  };
}

interface QuestionBankProps {
  questions: MyQuestion[];
}

function formatDate(value?: string) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const QuestionBank = ({ questions }: QuestionBankProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadQuestionPaper = async (data: CreateQuestionPaperData) => {
    try {
      const result = await createQuestionPaperAction(data);

      if (!result?.success) {
        toast.error(result?.message || "Something went wrong.");
        return;
      }

      toast.success("Question paper uploaded successfully.");
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to upload question paper:", error);
      toast.error("Something went wrong while uploading the question paper.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Question Bank</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Question Papers
          </h1>

          <p className="mt-2 text-sm text-muted">
            Explore question papers shared by your university community.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium">
            <FileText size={17} className="text-primary" />
            {questions.length}{" "}
            {questions.length === 1 ? "question paper" : "question papers"}
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            <Plus size={17} />
            Upload Question Paper
          </button>

          <CreateQuestionPaperModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleUploadQuestionPaper}
          />
        </div>
      </section>

      {/* Cards */}
      {questions.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {questions.map((question) => (
            <div
              key={question._id}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              {/* Card Header */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <GraduationCap size={25} />
                </div>

                <span className="rounded-lg bg-surface-secondary px-3 py-1.5 text-xs font-medium text-muted">
                  {question.examType}
                </span>
              </div>

              {/* Details */}
              <h3 className="text-lg font-bold tracking-tight">
                {question.title}
              </h3>

              <p className="mt-1 text-xs font-medium text-primary">
                {question.courseName}
              </p>

              <p className="mt-2 text-xs text-muted">
                {question.departmentName}
              </p>

              {/* Academic Details */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted">
                  Semester {question.semester}
                </span>

                <span className="rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted">
                  Batch {question.batch}
                </span>

                {question.section && (
                  <span className="rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted">
                    Section {question.section}
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Calendar size={15} />
                  {formatDate(question.createdAt) || "Recently uploaded"}
                </div>
              </div>

              {/* Uploader */}
              {question.uploadedBy && (
                <p className="mt-3 text-xs text-muted">
                  Uploaded by: {question.uploadedBy.name}
                </p>
              )}

              {/* Open Question Paper */}
              {question.driveUrl ? (
                <a
                  href={question.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground! no-underline! transition group-hover:border-primary group-hover:bg-primary group-hover:text-white!"
                >
                  View Question Paper
                  <ArrowUpRight size={17} />
                </a>
              ) : (
                <div className="mt-5 rounded-lg border border-border px-4 py-2.5 text-center text-sm text-muted">
                  Question paper link unavailable
                </div>
              )}
            </div>
          ))}
        </section>
      ) : (
        /* Empty State */
        <section className="rounded-xl border border-dashed border-border py-16 text-center">
          <FileQuestion size={35} className="mx-auto text-muted-foreground" />

          <h3 className="mt-4 font-semibold">No question papers yet</h3>

          <p className="mt-2 text-sm text-muted">
            Question papers uploaded by your university community will appear
            here.
          </p>
        </section>
      )}
    </div>
  );
};

export default QuestionBank;
