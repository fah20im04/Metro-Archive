"use client";

import { useRouter } from "next/navigation";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { RefreshCw, Users } from "lucide-react";

import {
    ChartCard,
    EmptyChart,
    axisTick,
    tooltipStyle,
} from "./shared";

interface StudentReportsProps {
    data: {
        totalStudents: number;
        byDepartment: { department: string; count: number }[];
        registrations: { month: string; count: number }[];
        filterOptions: {
            departments: string[];
            batches: string[];
        };
    };
    filters: {
        department: string;
        batch: string;
    };
}

export default function StudentReports({ data, filters }: StudentReportsProps) {
    const router = useRouter();

    const hasFilters = filters.department !== "" || filters.batch !== "";

    function updateFilters(next: { department: string; batch: string }) {
        const params = new URLSearchParams({ tab: "student" });

        if (next.department) params.set("department", next.department);
        if (next.batch) params.set("batch", next.batch);

        router.push(`/dashboard/admin/reports?${params.toString()}`, {
            scroll: false,
        });
    }

    const { byDepartment, registrations } = data;

    const registrationsTotal = registrations.reduce(
        (sum, item) => sum + item.count,
        0,
    );

    return (
        <div className="space-y-6">
            {/* Filters + total */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users size={21} />
                    </div>

                    <div>
                        <p className="text-xs text-muted">
                            {hasFilters ? "Students (filtered)" : "Total students"}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                            {data.totalStudents}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                        value={filters.department}
                        onChange={(e) =>
                            updateFilters({ department: e.target.value, batch: filters.batch })
                        }
                        aria-label="Filter by department"
                        className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    >
                        <option value="">All departments</option>
                        {data.filterOptions.departments.map((department) => (
                            <option key={department} value={department}>
                                {department}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.batch}
                        onChange={(e) =>
                            updateFilters({
                                department: filters.department,
                                batch: e.target.value,
                            })
                        }
                        aria-label="Filter by batch"
                        className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    >
                        <option value="">All batches</option>
                        {data.filterOptions.batches.map((batch) => (
                            <option key={batch} value={batch}>
                                Batch {batch}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => updateFilters({ department: "", batch: "" })}
                        disabled={!hasFilters}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <RefreshCw size={15} />
                        Reset
                    </button>
                </div>
            </div>

            {/* 1. Students by department */}
            <ChartCard
                title="Students by department"
                description="Number of registered students in each department."
            >
                {byDepartment.length === 0 ? (
                    <EmptyChart />
                ) : (
                    <div style={{ height: Math.max(240, byDepartment.length * 44) }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={byDepartment}
                                layout="vertical"
                                margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
                            >
                                <CartesianGrid
                                    horizontal={false}
                                    stroke="var(--border)"
                                    strokeDasharray="3 3"
                                />
                                <XAxis
                                    type="number"
                                    allowDecimals={false}
                                    tick={axisTick}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="department"
                                    width={90}
                                    tick={axisTick}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "var(--background)" }}
                                    contentStyle={tooltipStyle}
                                    formatter={(value) => [value, "Students"]}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="var(--primary)"
                                    radius={[0, 6, 6, 0]}
                                    barSize={22}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </ChartCard>

            {/* 3. Registrations over time */}
            <ChartCard
                title="Registrations over time"
                description={`New student sign-ups per month, last 12 months (${registrationsTotal} in total).`}
            >
                {registrationsTotal === 0 ? (
                    <EmptyChart />
                ) : (
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={registrations}
                                margin={{ top: 8, right: 16, bottom: 0, left: -16 }}
                            >
                                <defs>
                                    <linearGradient id="registrationsFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    vertical={false}
                                    stroke="var(--border)"
                                    strokeDasharray="3 3"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={axisTick}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={axisTick}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(value) => [value, "Registrations"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="var(--primary)"
                                    strokeWidth={2.5}
                                    fill="url(#registrationsFill)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </ChartCard>
        </div>
    );
}