import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, UserRound, FileQuestion, Library } from "lucide-react";

import { getCurrentUserAction } from "@/actions/auth";
import {
    getAdminFacultyReportsAction,
    getAdminStudentReportsAction,
} from "@/actions/admin";

import StudentReports from "@/app/Components/Dashboard/admin/reports/StudentReports";
import FacultyReports from "@/app/Components/Dashboard/admin/reports/FacultyReports";

const tabs = [
    { value: "student", label: "Student", icon: GraduationCap },
    { value: "faculty", label: "Faculty", icon: UserRound },
    { value: "question-bank", label: "Question Bank", icon: FileQuestion },
    { value: "resources", label: "Resources", icon: Library },
] as const;

type ReportTab = (typeof tabs)[number]["value"];

interface AdminReportsPageProps {
    searchParams: Promise<{
        tab?: string;
        department?: string;
        batch?: string;
        designation?: string;
    }>;
}

function isReportTab(value: string | undefined): value is ReportTab {
    return tabs.some((tab) => tab.value === value);
}

export default async function AdminReportsPage({
    searchParams,
}: AdminReportsPageProps) {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
        redirect("/auth/login");
    }

    if (auth.user.role !== "admin") {
        redirect("/dashboard");
    }

    const { tab, department = "", batch = "", designation = "" } =
        await searchParams;
    const activeTab: ReportTab = isReportTab(tab) ? tab : "student";

    const studentReports =
        activeTab === "student"
            ? await getAdminStudentReportsAction({ department, batch })
            : null;

    const facultyReports =
        activeTab === "faculty"
            ? await getAdminFacultyReportsAction({ department, designation })
            : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm font-medium text-primary">ADMINISTRATION</p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Reports &amp; Analytics
                </h1>

                <p className="mt-2 text-sm text-muted">
                    Overview of platform activity, content and users.
                </p>
            </div>

            {/* Tabs */}
            <nav
                aria-label="Report categories"
                className="flex gap-1 overflow-x-auto border-b border-border"
            >
                {tabs.map(({ value, label, icon: Icon }) => {
                    const isActive = activeTab === value;

                    return (
                        <Link
                            key={value}
                            href={`/dashboard/admin/reports?tab=${value}`}
                            scroll={false}
                            aria-current={isActive ? "page" : undefined}
                            className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium no-underline! transition ${isActive
                                    ? "border-primary text-primary!"
                                    : "border-transparent text-muted! hover:border-border hover:text-foreground!"
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Active tab content (only the selected tab is rendered) */}
            <section>
                {activeTab === "student" &&
                    (studentReports?.success ? (
                        <StudentReports
                            data={studentReports.data}
                            filters={{
                                department: department.trim().toUpperCase(),
                                batch: batch.trim(),
                            }}
                        />
                    ) : (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-500">
                            {studentReports?.message || "Failed to load student reports."}
                        </div>
                    ))}

                {activeTab === "faculty" &&
                    (facultyReports?.success ? (
                        <FacultyReports
                            data={facultyReports.data}
                            filters={{
                                department: department.trim(),
                                designation: designation.trim(),
                            }}
                        />
                    ) : (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-500">
                            {facultyReports?.message || "Failed to load faculty reports."}
                        </div>
                    ))}

                {activeTab === "question-bank" && (
                    <div>{/* <QuestionBankReports /> */}</div>
                )}

                {activeTab === "resources" && (
                    <div>{/* <ResourceReports /> */}</div>
                )}
            </section>
        </div>
    );
}