"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";

import {
  getAdminResourcesAction,
  updateAdminResourceAction,
  deleteAdminResourceAction,
  getAdminQuestionPapersAction,
  updateAdminQuestionPaperAction,
  deleteAdminQuestionPaperAction,
} from "@/actions/adminResource";

import ArchiveHeader from "./ArchiveHeader";
import ArchiveTabs from "./ArchiveTabs";
import ArchiveFilters from "./ArchiveFilters";
import ArchivePagination from "./ArchivePagination";
import ResourceTable from "./ResourceTable";
import QuestionPaperTable from "./QuestionPaperTable";
import ResourceEditModal from "./ResourceEditModal";
import QuestionPaperEditModal from "./QuestionPaperEditModal";

import type { TabType, Resource, QuestionPaper, Pagination } from "./types";

import { INITIAL_PAGINATION } from "./types";

export default function ArchiveManagement() {
  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [activeTab, setActiveTab] = useState<TabType>("resources");

  const [resources, setResources] = useState<Resource[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);

  const [pagination, setPagination] = useState<Pagination>(INITIAL_PAGINATION);

  // Search and filters
  const [search, setSearch] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [examType, setExamType] = useState("");
  const [section, setSection] = useState("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Editing states
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const [editingPaper, setEditingPaper] = useState<QuestionPaper | null>(null);

  // Used to trigger a fresh fetch after mutations
  const [refreshKey, setRefreshKey] = useState(0);

  // --------------------------------------------------
  // RESET FILTERS
  // --------------------------------------------------

  const resetFilters = useCallback(() => {
    setSearch("");
    setResourceType("");
    setDepartmentCode("");
    setDepartmentName("");
    setSemester("");
    setBatch("");
    setExamType("");
    setSection("");

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, []);

  // Filter setters that also reset pagination
  const updateSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateResourceType = (value: string) => {
    setResourceType(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateDepartmentCode = (value: string) => {
    setDepartmentCode(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateDepartmentName = (value: string) => {
    setDepartmentName(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateSemester = (value: string) => {
    setSemester(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateBatch = (value: string) => {
    setBatch(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateExamType = (value: string) => {
    setExamType(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateSection = (value: string) => {
    setSection(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // --------------------------------------------------
  // TAB CHANGE
  // --------------------------------------------------

  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    resetFilters();
    setPagination(INITIAL_PAGINATION);
  }

  // --------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);

      try {
        if (activeTab === "resources") {
          const result = await getAdminResourcesAction({
            page: pagination.currentPage,
            limit: pagination.limit,
            search,
            resourceType,
            departmentCode,
          });

          if (!active) return;

          if (!result.success || !("resources" in result)) {
            setResources([]);

            toast.error(
              "message" in result
                ? result.message
                : "Failed to load resources.",
            );

            return;
          }

          setResources(result.resources as Resource[]);
          setPagination(result.pagination);
        } else {
          const result = await getAdminQuestionPapersAction({
            page: pagination.currentPage,
            limit: pagination.limit,
            search,
            departmentName,
            semester,
            batch,
            examType,
            section,
          });

          if (!active) return;

          if (!result.success || !("papers" in result)) {
            setQuestionPapers([]);

            toast.error(
              "message" in result
                ? result.message
                : "Failed to load question papers.",
            );

            return;
          }

          setQuestionPapers(result.papers as QuestionPaper[]);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Archive management fetch error:", error);

        if (active) {
          toast.error("Something went wrong while loading records.");
        }
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [
    activeTab,
    pagination.currentPage,
    pagination.limit,
    search,
    resourceType,
    departmentCode,
    departmentName,
    semester,
    batch,
    examType,
    section,
    refreshKey,
  ]);

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  function refreshData() {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
  }

  // --------------------------------------------------
  // UPDATE RESOURCE
  // --------------------------------------------------

  async function handleUpdateResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingResource) return;

    const formData = new FormData(event.currentTarget);

    const data = {
      resourceTitle: String(formData.get("resourceTitle") || ""),
      courseName: String(formData.get("courseName") || ""),
      courseCode: String(formData.get("courseCode") || ""),
      departmentCode: String(formData.get("departmentCode") || ""),
      resourceType: String(formData.get("resourceType") || ""),
      driveUrl: String(formData.get("driveUrl") || ""),
    };

    try {
      setSaving(true);

      const result = await updateAdminResourceAction(editingResource._id, data);

      if (!result.success) {
        toast.error(result.message || "Failed to update resource.");
        return;
      }

      toast.success(result.message || "Resource updated successfully.");

      setEditingResource(null);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating the resource.");
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // UPDATE QUESTION PAPER
  // --------------------------------------------------

  async function handleUpdateQuestionPaper(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingPaper) return;

    const formData = new FormData(event.currentTarget);

    const data = {
      title: String(formData.get("title") || ""),
      courseName: String(formData.get("courseName") || ""),
      departmentName: String(formData.get("departmentName") || ""),
      semester: String(formData.get("semester") || ""),
      batch: String(formData.get("batch") || ""),
      section: String(formData.get("section") || ""),
      examType: String(formData.get("examType") || ""),
      driveUrl: String(formData.get("driveUrl") || ""),
    };

    try {
      setSaving(true);

      const result = await updateAdminQuestionPaperAction(
        editingPaper._id,
        data,
      );

      if (!result.success) {
        toast.error(result.message || "Failed to update question paper.");
        return;
      }

      toast.success(result.message || "Question paper updated successfully.");

      setEditingPaper(null);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating the question paper.");
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // DELETE RESOURCE
  // --------------------------------------------------

  async function handleDeleteResource(resource: Resource) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resource.resourceTitle}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(resource._id);

      const result = await deleteAdminResourceAction(resource._id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete resource.");
        return;
      }

      toast.success("Resource deleted successfully.");

      if (resources.length === 1 && pagination.currentPage > 1) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage - 1,
        }));
      } else {
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting the resource.");
    } finally {
      setDeletingId(null);
    }
  }

  // --------------------------------------------------
  // DELETE QUESTION PAPER
  // --------------------------------------------------

  async function handleDeleteQuestionPaper(paper: QuestionPaper) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${paper.title}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(paper._id);

      const result = await deleteAdminQuestionPaperAction(paper._id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete question paper.");
        return;
      }

      toast.success("Question paper deleted successfully.");

      if (questionPapers.length === 1 && pagination.currentPage > 1) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage - 1,
        }));
      } else {
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting the question paper.");
    } finally {
      setDeletingId(null);
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  const currentTotal = pagination.totalItems;

  return (
    <div className="w-full space-y-6 pb-10">
      {/* HEADER */}

      <ArchiveHeader
        onRefresh={refreshData}
        loading={loading}
        refreshing={refreshing}
      />

      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total resources</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {activeTab === "resources" ? currentTotal : "—"}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <FileText size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total question papers
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {activeTab === "questionPapers" ? currentTotal : "—"}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}

      <ArchiveTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* FILTERS */}

      <ArchiveFilters
        activeTab={activeTab}
        search={search}
        setSearch={updateSearch}
        resourceType={resourceType}
        setResourceType={updateResourceType}
        departmentCode={departmentCode}
        setDepartmentCode={updateDepartmentCode}
        departmentName={departmentName}
        setDepartmentName={updateDepartmentName}
        semester={semester}
        setSemester={updateSemester}
        batch={batch}
        setBatch={updateBatch}
        examType={examType}
        setExamType={updateExamType}
        section={section}
        setSection={updateSection}
        onClear={resetFilters}
      />

      {/* TABLE CONTAINER */}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">
              {activeTab === "resources"
                ? "All Resources"
                : "Question Paper Submissions"}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {currentTotal} total records found
            </p>
          </div>

          <span className="w-fit rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading records...</p>
          </div>
        ) : activeTab === "resources" && resources.length === 0 ? (
          <EmptyState onClear={resetFilters} />
        ) : activeTab === "questionPapers" && questionPapers.length === 0 ? (
          <EmptyState onClear={resetFilters} />
        ) : activeTab === "resources" ? (
          <ResourceTable
            resources={resources}
            deletingId={deletingId}
            onEdit={setEditingResource}
            onDelete={handleDeleteResource}
          />
        ) : (
          <QuestionPaperTable
            papers={questionPapers}
            deletingId={deletingId}
            onEdit={setEditingPaper}
            onDelete={handleDeleteQuestionPaper}
          />
        )}

        {/* PAGINATION */}

        {!loading && (
          <ArchivePagination
            pagination={pagination}
            onPageChange={(page) =>
              setPagination((prev) => ({
                ...prev,
                currentPage: page,
              }))
            }
            onLimitChange={(limit) =>
              setPagination((prev) => ({
                ...prev,
                currentPage: 1,
                limit,
              }))
            }
          />
        )}
      </div>

      {/* EDIT MODALS */}

      <ResourceEditModal
        resource={editingResource}
        saving={saving}
        onClose={() => setEditingResource(null)}
        onSubmit={handleUpdateResource}
      />

      <QuestionPaperEditModal
        paper={editingPaper}
        saving={saving}
        onClose={() => setEditingPaper(null)}
        onSubmit={handleUpdateQuestionPaper}
      />
    </div>
  );
}

// --------------------------------------------------
// EMPTY STATE
// --------------------------------------------------

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
      <div className="mb-3 rounded-full bg-muted p-4">
        <AlertCircle size={25} className="text-muted-foreground" />
      </div>

      <h3 className="font-semibold text-foreground">No records found</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        We couldn't find any records matching your search or filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Clear filters
      </button>
    </div>
  );
}
