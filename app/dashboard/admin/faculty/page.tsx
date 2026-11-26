import { redirect } from "next/navigation";

import { getCurrentUserAction } from "@/actions/auth";
import { getAdminFacultyOverviewAction } from "@/actions/admin";

import FacultyKpiCards from "@/app/Components/Dashboard/admin/faculty/FacultyKpiCards";

export default async function AdminFacultyPage() {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
        redirect("/auth/login");
    }

    if (auth.user.role !== "admin") {
        redirect("/dashboard");
    }

    const result = await getAdminFacultyOverviewAction();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm font-medium text-primary">ADMINISTRATION</p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Faculty Management
                </h1>

                <p className="mt-2 text-sm text-muted">
                    Overview of faculty profiles, upvotes and reviews.
                </p>
            </div>

            {/* KPI cards */}
            {result.success ? (
                <FacultyKpiCards stats={result.stats} />
            ) : (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-500">
                    {result.message}
                </div>
            )}

            {/* More faculty management components go here */}
        </div>
    );
}