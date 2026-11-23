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
  "/dashboard/archives": "My Archives",
  "/dashboard/question-bank": "Question Bank",
  "/dashboard/faculty": "Faculty",
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

export default function DashboardTopbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isDark = resolvedTheme === "dark";
  const pageTitle = pageTitles[pathname] || "Dashboard";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await logoutAction();

      if (result.success) {
        router.replace("/auth/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
      setProfileOpen(false);
    }
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
          Manage your university archive.
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

            <span className="hidden text-sm font-medium sm:block">
              My Account
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

              <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-border bg-surface p-2 shadow-xl">
                <div className="border-b border-border px-3 py-3">
                  <p className="text-sm font-semibold">My Account</p>
                  <p className="mt-1 text-xs text-muted">Manage your account</p>
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

                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
