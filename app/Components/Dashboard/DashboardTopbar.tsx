"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { logoutAction } from "@/actions/auth";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/student": "Student Overview",
  "/dashboard/admin": "Admin Overview",

  "/dashboard/student/archives": "My Archives",
  "/dashboard/student/question-bank": "Question Bank",

  "/dashboard/faculty": "Faculty Directory",
  "/dashboard/bookmarks": "Saved Resources",
  "/dashboard/contributions": "My Contributions",
  "/dashboard/settings": "Settings",

  "/dashboard/admin/users": "User Management",
  "/dashboard/admin/faculty": "Faculty Management",
  "/dashboard/admin/archives": "Archive Management",
  "/dashboard/admin/resources": "Question Management",
  "/dashboard/admin/reviews": "Review Moderation",
  "/dashboard/admin/reports": "Reports & Analytics",
};

import type { UserRole } from "@/models/user";

interface DashboardTopbarProps {
  user: {
    id: string;
    name: string;
    universityId: string;
    email: string;
    role: UserRole;
    departmentId: string | null;
    batch: string | null;
    accountStatus: "active";
    createdAt: string;
  };
}

export default function DashboardTopbar({ user }: DashboardTopbarProps) {
  console.log("user info", user);

  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);

  const isDark = resolvedTheme === "dark";

  const pageTitle = pageTitles[pathname] || "Dashboard";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-border bg-background/90 px-4 pl-16 backdrop-blur-md sm:px-6 sm:pl-20 lg:px-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <LayoutDashboard size={17} className="hidden text-primary sm:block" />

          <h1 className="text-sm font-semibold sm:text-base">{pageTitle}</h1>
        </div>

        <p className="mt-1 hidden text-xs text-muted sm:block">
          {user.role === "admin"
            ? "Manage your university platform."
            : "Manage your academic resources and activities."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-secondary"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-secondary"
        >
          <Bell size={19} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-2.5 transition hover:bg-surface-secondary sm:px-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light text-primary">
              <UserRound size={17} />
            </div>

            <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
              {user.name}
            </span>

            <ChevronDown
              size={15}
              className={`hidden text-muted transition sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              {/* Close dropdown when clicking outside */}
              <button
                type="button"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-border bg-surface p-2 shadow-xl">
                <div className="border-b border-border px-3 py-3">
                  <p className="truncate text-sm font-semibold">{user.name}</p>

                  <p className="mt-1 truncate text-xs text-muted">
                    {user.email}
                  </p>

                  <span className="mt-2 inline-flex rounded-lg bg-primary-light px-2.5 py-1 text-[11px] font-semibold capitalize text-primary">
                    {user.role}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/dashboard/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-surface-secondary"
                >
                  <Settings size={17} />
                  Settings
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
