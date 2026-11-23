"use client";

import React from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    Calendar,
    FileQuestion,
    FileText,
    GraduationCap,
    Heart,
    Search,
} from "lucide-react";

import type { ResourceItem } from "@/app/Components/archive/Archive";

type MyQuestion = ResourceItem & { createdAt?: string };

interface QuestionBankProps {
    questions: MyQuestion[];
}

// Fixed locale and timezone so server and browser render the same text
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
    return (
        <div className="space-y-8">
            {/* Header */}
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-primary">Question Bank</p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Your Question Papers
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        Previous question papers you have shared with the community.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium">
                        <FileText size={17} className="text-primary" />
                        {questions.length}{" "}
                        {questions.length === 1 ? "question paper" : "question papers"}
                    </div>

                    <Link
                        href="/question-bank"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white! no-underline! transition hover:bg-primary-hover"
                    >
                        <Search size={17} />
                        Browse Question Bank
                    </Link>
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
                                    {question.departmentCode || "General"}
                                </span>
                            </div>

                            {/* Details */}
                            <h3 className="text-lg font-bold tracking-tight">
                                {question.resourceTitle}
                            </h3>

                            <p className="mt-1 text-xs font-medium text-primary">
                                {question.courseCode} · {question.courseName}
                            </p>

                            {/* Date and Likes */}
                            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                <div className="flex items-center gap-1.5 text-xs text-muted">
                                    <Calendar size={15} />
                                    {formatDate(question.createdAt) || "Recently uploaded"}
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-muted">
                                    <Heart size={15} />
                                    {question.likeCount || 0}
                                </div>
                            </div>

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
                    <FileQuestion
                        size={35}
                        className="mx-auto text-muted-foreground"
                    />

                    <h3 className="mt-4 font-semibold">No question papers yet</h3>

                    <p className="mt-2 text-sm text-muted">
                        Question papers you upload will show up here.
                    </p>
                </section>
            )}
        </div>
    );
};

export default QuestionBank;