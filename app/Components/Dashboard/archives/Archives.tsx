"use client";

import React from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    Calendar,
    FileText,
    FolderOpen,
    GraduationCap,
    Heart,
    Search,
} from "lucide-react";

import type { ResourceItem } from "@/app/Components/archive/Archive";

type MyResource = ResourceItem & { createdAt?: string };

interface ArchivesProps {
    resources: MyResource[];
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

const Archives = ({ resources }: ArchivesProps) => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-primary">Archives</p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Your Uploaded Resources
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        Everything you have shared with the community, in one place.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium">
                        <FileText size={17} className="text-primary" />
                        {resources.length} {resources.length === 1 ? "resource" : "resources"}
                    </div>

                    <Link
                        href="/archives"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white! no-underline! transition hover:bg-primary-hover"
                    >
                        <Search size={17} />
                        Browse Archives
                    </Link>
                </div>
            </section>

            {/* Cards */}
            {resources.length > 0 ? (
                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {resources.map((resource) => (
                        <div
                            key={resource._id}
                            className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                        >
                            {/* Card Header */}
                            <div className="mb-5 flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                                    <GraduationCap size={25} />
                                </div>

                                <span className="rounded-lg bg-surface-secondary px-3 py-1.5 text-xs font-medium text-muted">
                                    {resource.departmentCode || "General"}
                                </span>
                            </div>

                            {/* Details */}
                            <h3 className="text-lg font-bold tracking-tight">
                                {resource.resourceTitle}
                            </h3>

                            <p className="mt-1 text-xs font-medium text-primary">
                                {resource.courseCode} · {resource.courseName}
                            </p>

                            <div className="mt-3">
                                <span className="inline-flex rounded-md bg-accent-light px-2.5 py-1 text-xs font-medium text-accent">
                                    {resource.resourceType}
                                </span>
                            </div>

                            {/* Date and Likes */}
                            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                <div className="flex items-center gap-1.5 text-xs text-muted">
                                    <Calendar size={15} />
                                    {formatDate(resource.createdAt) || "Recently uploaded"}
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-muted">
                                    <Heart size={15} />
                                    {resource.likeCount || 0}
                                </div>
                            </div>

                            {/* Open Resource */}
                            {resource.driveUrl ? (
                                <a
                                    href={resource.driveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground! no-underline! transition group-hover:border-primary group-hover:bg-primary group-hover:text-white!"
                                >
                                    View Resource
                                    <ArrowUpRight size={17} />
                                </a>
                            ) : (
                                <div className="mt-5 rounded-lg border border-border px-4 py-2.5 text-center text-sm text-muted">
                                    Resource link unavailable
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            ) : (
                /* Empty State */
                <section className="rounded-xl border border-dashed border-border py-16 text-center">
                    <FolderOpen size={35} className="mx-auto text-muted-foreground" />

                    <h3 className="mt-4 font-semibold">No uploads yet</h3>

                    <p className="mt-2 text-sm text-muted">
                        Resources you upload will show up here.
                    </p>
                </section>
            )}
        </div>
    );
};

export default Archives;