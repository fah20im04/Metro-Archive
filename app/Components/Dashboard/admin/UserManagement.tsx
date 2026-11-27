"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Mail,
  CalendarDays,
  X,
  Pencil,
  Ban,
  CheckCircle2,
  Save,
  Search,
} from "lucide-react";

import {
  getAdminUsersAction,
  updateAdminUserAction,
  updateAdminUserStatusAction,
} from "@/actions/admin";
import { toast } from "sonner";

// --------------------------------------------------
// Types
// --------------------------------------------------

interface AdminUser {
  _id: string;
  name: string;
  universityId: string;
  email: string;
  role: "student" | "admin";
  departmentName: string | null;
  batch: string | null;
  accountStatus: "pending" | "active" | "suspended";
  createdAt: string | Date;
}

interface Pagination {
  currentPage: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

interface UserManagementProps {
  initialUsers: AdminUser[];
  initialPagination: Pagination;
}

type RoleFilter = "all" | "student" | "admin";
type StatusFilter = "all" | "pending" | "active" | "suspended";

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function UserManagement({
  initialUsers,
  initialPagination,
}: UserManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Edit modal state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    universityId: "",
    email: "",
    departmentName: "",
    batch: "",
  });

  const [saving, setSaving] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  // --------------------------------------------------
  // Fetch users
  // --------------------------------------------------

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminUsersAction({
        page: pagination.currentPage,
        limit: pagination.limit,
        search,
        role,
        status,
        department,
      });

      if (!result.success || !result.pagination) {
        setError(result.message || "Failed to load users.");
        return;
      }

      setUsers(result.users);
      setPagination(result.pagination);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.limit,
    search,
    role,
    status,
    department,
  ]);

  // Debounced search and filters
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 350);

    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  // --------------------------------------------------
  // Filter helpers
  // --------------------------------------------------

  const hasFilters =
    search.trim() !== "" ||
    role !== "all" ||
    status !== "all" ||
    department.trim() !== "";

  const resetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setDepartment("");

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const changePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;

    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // --------------------------------------------------
  // Date and status helpers
  // --------------------------------------------------

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (accountStatus: string) => {
    switch (accountStatus) {
      case "active":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

      case "pending":
        return "border-amber-500/20 bg-amber-500/10 text-amber-600";

      case "suspended":
        return "border-red-500/20 bg-red-500/10 text-red-600";

      default:
        return "border-border bg-background text-muted";
    }
  };

  // --------------------------------------------------
  // Edit user
  // --------------------------------------------------

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);

    setEditForm({
      name: user.name,
      universityId: user.universityId,
      email: user.email,
      departmentName: user.departmentName || "",
      batch: user.batch || "",
    });
  };

  const closeEditModal = () => {
    if (saving) return;

    setEditingUser(null);

    setEditForm({
      name: "",
      universityId: "",
      email: "",
      departmentName: "",
      batch: "",
    });
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingUser) return;

    setSaving(true);

    const toastId = toast.loading("Updating user details...");

    try {
      const result = await updateAdminUserAction(editingUser._id, {
        name: editForm.name.trim(),
        universityId: editForm.universityId.trim(),
        email: editForm.email.trim(),
        departmentName: editForm.departmentName.trim(),
        batch: editForm.batch.trim(),
      });

      if (!result.success) {
        toast.error(result.message || "Failed to update user.", {
          id: toastId,
        });
        return;
      }

      // Update the table immediately
      setUsers((prev) =>
        prev.map((user) =>
          user._id === editingUser._id
            ? {
                ...user,
                name: editForm.name.trim(),
                universityId: editForm.universityId.trim().toUpperCase(),
                email: editForm.email.trim().toLowerCase(),
                departmentName: editForm.departmentName.trim()
                  ? editForm.departmentName.trim().toUpperCase()
                  : null,
                batch: editForm.batch.trim() || null,
              }
            : user,
        ),
      );

      toast.success("User details updated successfully!", {
        id: toastId,
      });

      setEditingUser(null);
    } catch (err) {
      console.error("Update user error:", err);

      toast.error("Something went wrong while updating the user.", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Activate / Suspend user
  // --------------------------------------------------

  const handleStatusChange = async (user: AdminUser) => {
    const nextStatus = user.accountStatus === "active" ? "suspended" : "active";

    const confirmed = window.confirm(
      nextStatus === "suspended"
        ? `Are you sure you want to suspend ${user.name}'s account?`
        : `Are you sure you want to activate ${user.name}'s account?`,
    );

    if (!confirmed) return;

    setActionUserId(user._id);

    const toastId = toast.loading(
      nextStatus === "suspended"
        ? "Suspending user account..."
        : "Activating user account...",
    );

    try {
      const result = await updateAdminUserStatusAction(user._id, nextStatus);

      if (!result.success) {
        toast.error(result.message || "Failed to update account status.", {
          id: toastId,
        });
        return;
      }

      // Update status immediately in the table
      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id ? { ...item, accountStatus: nextStatus } : item,
        ),
      );

      toast.success(
        nextStatus === "suspended"
          ? `${user.name}'s account has been suspended.`
          : `${user.name}'s account has been activated.`,
        { id: toastId },
      );
    } catch (err) {
      console.error("Account status error:", err);

      toast.error("Something went wrong while changing account status.", {
        id: toastId,
      });
    } finally {
      setActionUserId(null);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <Users size={16} />
            <span>Administration</span>
            <span>/</span>
            <span className="text-foreground">User Management</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            User Management
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage student and administrator accounts across CampusVault.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
          <Users size={18} className="text-primary" />
          <div>
            <p className="text-xs text-muted">Total registered users</p>
            <p className="text-lg font-bold text-foreground">
              {pagination.totalUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Notice */}
      {notice && (
        <div
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            notice.toLowerCase().includes("successfully") ||
            notice.toLowerCase().includes("activated") ||
            notice.toLowerCase().includes("suspended")
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              : "border-red-500/20 bg-red-500/10 text-red-500"
          }`}
        >
          <p>{notice}</p>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users size={21} />
            </div>
            <span className="text-xs font-medium text-muted">
              User directory
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-foreground">
            {pagination.totalUsers}
          </h3>

          <p className="mt-1 text-sm text-muted">Registered accounts</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <GraduationCap size={21} />
            </div>
            <span className="text-xs font-medium text-muted">Account type</span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-foreground">Students</h3>

          <p className="mt-1 text-sm text-muted">
            Student accounts are managed here
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck size={21} />
            </div>
            <span className="text-xs font-medium text-muted">Permissions</span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-foreground">Admin</h3>

          <p className="mt-1 text-sm text-muted">
            Administrator accounts are included
          </p>
        </div>
      </div>

      {/* User Directory */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Directory Header */}
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                User Directory
              </h2>

              <p className="mt-1 text-sm text-muted">
                Search and manage registered accounts.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters && !loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
            >
              <RefreshCw size={15} />
              Reset filters
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: 1,
                  }));
                }}
                placeholder="Search name, ID or email..."
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Role Filter */}
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as RoleFilter);
                setPagination((prev) => ({
                  ...prev,
                  currentPage: 1,
                }));
              }}
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All roles</option>
              <option value="student">Students</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPagination((prev) => ({
                  ...prev,
                  currentPage: 1,
                }));
              }}
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Department Filter */}
            <div className="relative sm:col-span-2 lg:col-span-4">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: 1,
                  }));
                }}
                placeholder="Filter by department (e.g. CSE, EEE, BBA)"
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-lg">
                <RefreshCw size={16} className="animate-spin text-primary" />
                Loading users...
              </div>
            </div>
          )}

          <table className="w-full min-w-262.5 text-left">
            <thead className="bg-background/70">
              <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">University ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center">
                    <p className="font-medium text-red-500">{error}</p>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-background/60"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {user.name
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("")}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-47.5 truncate text-sm font-semibold text-foreground">
                            {user.name}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                            <Mail size={12} />
                            <span className="max-w-47.5 truncate">
                              {user.email}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* University ID */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground">
                        {user.universityId}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {user.departmentName || "—"}
                      </p>

                      {user.batch && (
                        <p className="mt-1 text-xs text-muted">
                          Batch {user.batch}
                        </p>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-blue-500/20 bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Student"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyle(
                          user.accountStatus,
                        )}`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                        {user.accountStatus}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted">
                        <CalendarDays size={14} />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          disabled={actionUserId === user._id}
                          title="Edit user"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Activate / Suspend */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user)}
                          disabled={actionUserId === user._id}
                          title={
                            user.accountStatus === "active"
                              ? "Suspend account"
                              : "Activate account"
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${
                            user.accountStatus === "active"
                              ? "border-red-500/20 text-red-500 hover:bg-red-500/10"
                              : "border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
                          }`}
                        >
                          {actionUserId === user._id ? (
                            <RefreshCw size={15} className="animate-spin" />
                          ) : user.accountStatus === "active" ? (
                            <Ban size={15} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-muted">
                      <Users size={23} />
                    </div>

                    <h3 className="mt-3 font-semibold text-foreground">
                      No users found
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      Try changing your search or filters.
                    </p>

                    {hasFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                      >
                        <X size={14} />
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {pagination.totalUsers === 0
                ? 0
                : (pagination.currentPage - 1) * pagination.limit + 1}
              {" - "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalUsers,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {pagination.totalUsers}
            </span>{" "}
            users
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="min-w-20 text-center text-sm font-medium text-foreground">
              Page {pagination.currentPage} of{" "}
              {Math.max(1, pagination.totalPages)}
            </span>

            <button
              type="button"
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage >= pagination.totalPages || loading
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Edit User</h2>
                <p className="mt-1 text-sm text-muted">
                  Update this user&apos;s account information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-foreground disabled:opacity-40"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  University ID
                </label>
                <input
                  type="text"
                  required
                  value={editForm.universityId}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      universityId: e.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. 241-115-021"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Enter email address"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editForm.departmentName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        departmentName: e.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. CSE"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={editForm.batch}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        batch: e.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. 60"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:bg-background disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
