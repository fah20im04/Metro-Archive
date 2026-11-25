"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileQuestion,
  Search,
  Upload,
  FolderOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getMyResourcesAction } from "@/actions/resource";
import { getMyQuestionPapersAction } from "@/actions/questionPaper";

import ContributionCard from "@/app/Components/Reusable/ContributionCard";

type ContributionType = "notes" | "question-papers";

interface ResourceItem {
  _id: string;
  resourceTitle: string;
  courseName: string;
  courseCode: string;
  departmentCode: string;
  resourceType: string;
  driveUrl: string;
  createdAt?: string;
}

interface QuestionPaperItem {
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
}

export default function MyContribution() {
  const [activeTab, setActiveTab] = useState<ContributionType>("notes");

  const [searchQuery, setSearchQuery] = useState("");

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [papers, setPapers] = useState<QuestionPaperItem[]>([]);

  const [loading, setLoading] = useState(true);

  // Fetch student's contributions
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);

        const [resourceResult, paperResult] = await Promise.all([
          getMyResourcesAction(),
          getMyQuestionPapersAction(),
        ]);

        if (resourceResult.success) {
          setResources(resourceResult.resources as ResourceItem[]);
        } else {
          toast.error(resourceResult.message || "Could not load your notes.");
        }

        if (paperResult.success) {
          setPapers(paperResult.papers as QuestionPaperItem[]);
        } else {
          toast.error(
            paperResult.message || "Could not load your question papers.",
          );
        }
      } catch (error) {
        console.error("Fetch contributions error:", error);
        toast.error("Something went wrong while loading contributions.");
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const filteredResources = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return resources.filter((resource) =>
      `${resource.resourceTitle} ${resource.courseName} ${resource.courseCode}`
        .toLowerCase()
        .includes(query),
    );
  }, [resources, searchQuery]);

  const filteredPapers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return papers.filter((paper) =>
      `${paper.title} ${paper.courseName} ${paper.examType} ${paper.batch}`
        .toLowerCase()
        .includes(query),
    );
  }, [papers, searchQuery]);

  const isNotes = activeTab === "notes";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">YOUR ACTIVITY</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            My Contributions
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage and keep track of the study materials you&apos;ve shared.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 rounded-xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen size={22} />
          </div>

          <div>
            <p className="text-sm text-muted">Notes Uploaded</p>
            <h2 className="mt-1 text-2xl font-bold">{resources.length}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4 rounded-xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileQuestion size={22} />
          </div>

          <div>
            <p className="text-sm text-muted">Question Papers Uploaded</p>
            <h2 className="mt-1 text-2xl font-bold">{papers.length}</h2>
          </div>
        </div>
      </div>

      {/* Total Contributions */}
      <div className="card flex items-center justify-between gap-4 rounded-xl p-5">
        <div>
          <p className="text-sm text-muted">Total Contributions</p>
          <h2 className="mt-1 text-3xl font-bold">
            {resources.length + papers.length}
          </h2>
          <p className="mt-1 text-xs text-muted">
            Materials you&apos;ve shared with the university community
          </p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="card rounded-xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full rounded-xl bg-surface-secondary p-1 sm:w-fit">
            <button
              type="button"
              onClick={() => {
                setActiveTab("notes");
                setSearchQuery("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
                isNotes
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <BookOpen size={17} />
              Notes ({resources.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("question-papers");
                setSearchQuery("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
                !isNotes
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <FileQuestion size={17} />
              Papers ({papers.length})
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${isNotes ? "notes" : "question papers"}...`}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Contribution List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isNotes ? "Your Uploaded Notes" : "Your Uploaded Question Papers"}
          </h2>

          <span className="text-sm text-muted">
            {isNotes ? filteredResources.length : filteredPapers.length} items
          </span>
        </div>

        {loading ? (
          <div className="card flex items-center justify-center rounded-xl py-16">
            <div className="flex items-center gap-3 text-sm text-muted">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading contributions...
            </div>
          </div>
        ) : isNotes ? (
          filteredResources.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredResources.map((resource) => (
                <ContributionCard
                  key={resource._id}
                  title={resource.resourceTitle}
                  courseName={resource.courseName}
                  subtitle={resource.courseCode}
                  type="notes"
                  badges={[
                    resource.resourceType || "Notes",
                    resource.departmentCode,
                  ].filter(Boolean)}
                  driveUrl={resource.driveUrl}
                  createdAt={resource.createdAt}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="notes" />
          )
        ) : filteredPapers.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredPapers.map((paper) => (
              <ContributionCard
                key={paper._id}
                title={paper.title}
                courseName={paper.courseName}
                subtitle={paper.departmentName}
                type="question-papers"
                badges={[
                  paper.examType,
                  `Semester ${paper.semester}`,
                  `Batch ${paper.batch}`,
                  ...(paper.section ? [`Section ${paper.section}`] : []),
                ]}
                driveUrl={paper.driveUrl}
                createdAt={paper.createdAt}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="question-papers" />
        )}
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: ContributionType }) {
  const isNotes = type === "notes";

  return (
    <div className="card flex flex-col items-center justify-center rounded-xl px-5 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
        {isNotes ? <FolderOpen size={29} /> : <GraduationCap size={29} />}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {isNotes ? "No notes uploaded yet" : "No question papers uploaded yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted">
        {isNotes
          ? "You haven't shared any notes yet. Upload your study materials to help other students."
          : "You haven't shared any question papers yet. Contribute papers to help your university community."}
      </p>

      <Link
        href="/dashboard/student/upload"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white! transition hover:opacity-90"
      >
        <Upload size={16} />
        Upload Material
      </Link>
    </div>
  );
}
