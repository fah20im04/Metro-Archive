"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Archive,
  BookOpen,
  GraduationCap,
  Bookmark,
  FileText,
  Settings,
  Users,
  ShieldCheck,
  BarChart3,
  X,
  Menu,
  ChevronLeft,
} from "lucide-react";

const studentLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Archives", href: "/dashboard/archives", icon: Archive },
  { label: "Question Bank", href: "/dashboard/question-bank", icon: BookOpen },
  {
    label: "Faculty Directory",
    href: "/dashboard/faculty",
    icon: GraduationCap,
  },
  { label: "Saved Resources", href: "/dashboard/bookmarks", icon: Bookmark },
  {
    label: "My Contributions",
    href: "/dashboard/contributions",
    icon: FileText,
  },
];

const adminLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", href: "/dashboard/admin/users", icon: Users },
  {
    label: "Faculty Management",
    href: "/dashboard/admin/faculty",
    icon: GraduationCap,
  },
  {
    label: "Archive Management",
    href: "/dashboard/admin/archives",
    icon: Archive,
  },
  {
    label: "Question Management",
    href: "/dashboard/admin/resources",
    icon: BookOpen,
  },
  {
    label: "Review Moderation",
    href: "/dashboard/admin/reviews",
    icon: ShieldCheck,
  },
  {
    label: "Reports & Analytics",
    href: "/dashboard/admin/reports",
    icon: BarChart3,
  },
];

const facultyLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/dashboard/faculty", icon: GraduationCap },
  { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Student Feedback", href: "/dashboard/feedback", icon: Users },
  { label: "Resources", href: "/dashboard/resources", icon: Archive },
];

export default function DashboardSidebar({
  role = "student",
}: {
  role?: "student" | "faculty" | "admin";
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links =
    role === "admin"
      ? adminLinks
      : role === "faculty"
        ? facultyLinks
        : studentLinks;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open dashboard menu"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-sm lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[72px] items-center justify-between border-b border-border px-6">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap size={23} />
            </div>

            <Link href="/" className="block">
              <h2 className="text-lg font-bold tracking-tight">MUArchive</h2>
              <p className="text-[11px] text-muted">University Archive</p>
            </Link>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-muted transition hover:bg-surface-secondary lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Main Menu
          </p>

          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:bg-surface-secondary hover:text-foreground"
                  }`}
                >
                  <Icon size={19} />

                  <span>{item.label}</span>

                  {active && (
                    <ChevronLeft size={16} className="ml-auto rotate-180" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="my-7 border-t border-border" />

          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Preferences
          </p>

          <Link
            href="/dashboard/settings"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              isActive("/dashboard/settings")
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface-secondary hover:text-foreground"
            }`}
          >
            <Settings size={19} />
            Settings
          </Link>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-4">
          <div className="rounded-xl bg-primary-light p-4">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={19} />
              <span className="text-sm font-semibold">CampusVault</span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-muted">
              Your university's academic resources, organized in one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
