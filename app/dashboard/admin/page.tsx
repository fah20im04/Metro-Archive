import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCurrentUserAction } from "@/actions/auth";
import { getAdminDashboardStatsAction } from "@/actions/admin";

import { Users, GraduationCap, FileText, ClipboardList } from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <div className="card rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>

        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-tight">
        {value.toLocaleString()}
      </h2>

      <p className="mt-1 text-xs text-muted">{description}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    redirect("/auth/login");
  }

  if (auth.user.role !== "admin") {
    redirect("/dashboard");
  }

  const result = await getAdminDashboardStatsAction();
  const stats = result.stats;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <p className="text-sm font-medium text-primary">
          ADMINISTRATION PORTAL
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome, {auth.user.name}
        </h1>

        <p className="mt-2 text-sm text-muted">
          Manage university resources, students, faculty, and platform
          activities.
        </p>
      </div>

      {/* Platform Statistics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Platform Overview</h2>

          <p className="text-sm text-muted">
            A quick overview of your university archive.
          </p>
        </div>

        {stats ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              description="Registered student accounts"
              icon={GraduationCap}
            />

            <StatCard
              title="Total Faculty"
              value={stats.totalFaculty}
              description="University faculty profiles"
              icon={Users}
            />

            <StatCard
              title="Total Resources"
              value={stats.totalResources}
              description="Uploaded notes and resources"
              icon={FileText}
            />

            <StatCard
              title="Question Papers"
              value={stats.totalQuestionPapers}
              description="Available question papers"
              icon={ClipboardList}
            />
          </div>
        ) : (
          <div className="card rounded-xl p-6">
            <p className="text-sm text-destructive">
              {result.message || "Unable to load dashboard statistics."}
            </p>
          </div>
        )}
      </section>

      {/* Faculty Review Management */}
      <section className="card rounded-xl border p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Faculty Review Management</h2>

            <p className="mt-1 text-sm text-muted">
              Review and moderate student feedback about faculty members.
            </p>
          </div>

          <Link
            href="/dashboard/admin/review"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Manage Reviews
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
