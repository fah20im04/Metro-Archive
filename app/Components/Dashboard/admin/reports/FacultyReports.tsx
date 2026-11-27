"use client";

import { useRouter } from "next/navigation";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Clock, RefreshCw, ThumbsUp, Users } from "lucide-react";

import {
    ChartCard,
    EmptyChart,
    axisTick,
    tooltipStyle,
} from "./shared";

interface FacultyReportsProps {
    data: {
        totalFaculty: number;
        totalUpvotes: number;
        pendingReviews: number;
        byDepartment: { department: string; count: number }[];
        byDesignation: { designation: string; count: number }[];
        topUpvoted: { name: string; upvotes: number }[];
        reviewsByStatus: { status: string; count: number }[];
        filterOptions: {
            departments: string[];
            designations: string[];
        };
    };
    filters: {
        department: string;
        designation: string;
    };
}

const DESIGNATION_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#7c3aed",
    "#0891b2",
    "#db2777",
    "#65a30d",
    "#475569",
];

const STATUS_COLORS: Record<string, string> = {
    approved: "#16a34a",
    pending: "#f59e0b",
    rejected: "#dc2626",
};

function truncate(value: string, max = 20) {
    return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export default function FacultyReports({ data, filters }: FacultyReportsProps) {
    const router = useRouter();

    const hasFilters = filters.department !== "" || filters.designation !== "";

    function updateFilters(next: { department: string; designation: string }) {
        const params = new URLSearchParams({ tab: "faculty" });

        if (next.department) params.set("department", next.department);
        if (next.designation) params.set("designation", next.designation);

        router.push(`/dashboard/admin/reports?${params.toString()}`, {
            scroll: false,
        });
    }

    const { byDepartment, byDesignation, topUpvoted, reviewsByStatus } = data;

    const totalReviews = reviewsByStatus.reduce(
        (sum, item) => sum + item.count,
        0,
    );

    const kpis = [
        {
            label: hasFilters ? "Faculty (filtered)" : "Total faculty",
            value: data.totalFaculty,
            icon: Users,
            color: "bg-primary/10 text-primary",
        },
        {
            label: "Total upvotes",
            value: data.totalUpvotes,
            icon: ThumbsUp,
            color: "bg-blue-500/10 text-blue-600",
        },
        {
            label: "Pending reviews",
            value: data.pendingReviews,
            icon: Clock,
            color: "bg-amber-500/10 text-amber-600",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-end">
                <select
                    value={filters.department}
                    onChange={(e) =>
                        updateFilters({
                            department: e.target.value,
                            designation: filters.designation,
                        })
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
                    value={filters.designation}
                    onChange={(e) =>
                        updateFilters({
                            department: filters.department,
                            designation: e.target.value,
                        })
                    }
                    aria-label="Filter by designation"
                    className="h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                    <option value="">All designations</option>
                    {data.filterOptions.designations.map((designation) => (
                        <option key={designation} value={designation}>
                            {designation}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() => updateFilters({ department: "", designation: "" })}
                    disabled={!hasFilters}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RefreshCw size={15} />
                    Reset
                </button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {kpis.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5"
                    >
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
                        >
                            <Icon size={21} />
                        </div>

                        <div>
                            <p className="text-xs text-muted">{label}</p>
                            <p className="text-2xl font-bold text-foreground">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 1. Faculty by department */}
            <ChartCard
                title="Faculty by department"
                description="A faculty member who belongs to several departments is counted in each."
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
                                    formatter={(value) => [value, "Faculty"]}
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

            <div className="grid gap-6 lg:grid-cols-2">
                {/* 2. Faculty by designation */}
                <ChartCard
                    title="Faculty by designation"
                    description="Share of faculty at each rank."
                >
                    {byDesignation.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={byDesignation}
                                        dataKey="count"
                                        nameKey="designation"
                                        innerRadius="55%"
                                        outerRadius="85%"
                                        paddingAngle={2}
                                        stroke="var(--surface)"
                                    >
                                        {byDesignation.map((item, index) => (
                                            <Cell
                                                key={item.designation}
                                                fill={DESIGNATION_COLORS[index % DESIGNATION_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>

                {/* 4. Reviews by status */}
                <ChartCard
                    title="Reviews by status"
                    description={`Moderation overview across all ${totalReviews} reviews (not affected by filters).`}
                >
                    {totalReviews === 0 ? (
                        <EmptyChart />
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={reviewsByStatus}
                                        dataKey="count"
                                        nameKey="status"
                                        innerRadius="55%"
                                        outerRadius="85%"
                                        paddingAngle={2}
                                        stroke="var(--surface)"
                                    >
                                        {reviewsByStatus.map((item) => (
                                            <Cell key={item.status} fill={STATUS_COLORS[item.status]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend
                                        wrapperStyle={{ fontSize: 12 }}
                                        formatter={(value) =>
                                            String(value).charAt(0).toUpperCase() +
                                            String(value).slice(1)
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>
            </div>

            {/* 3. Top faculty by upvotes */}
            <ChartCard
                title="Top faculty by upvotes"
                description="The 10 most upvoted faculty members."
            >
                {topUpvoted.length === 0 ? (
                    <EmptyChart />
                ) : (
                    <div style={{ height: Math.max(240, topUpvoted.length * 44) }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topUpvoted}
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
                                    dataKey="name"
                                    width={150}
                                    tick={axisTick}
                                    tickFormatter={(value) => truncate(String(value))}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "var(--background)" }}
                                    contentStyle={tooltipStyle}
                                    formatter={(value) => [value, "Upvotes"]}
                                />
                                <Bar
                                    dataKey="upvotes"
                                    fill="var(--accent)"
                                    radius={[0, 6, 6, 0]}
                                    barSize={22}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </ChartCard>
        </div>
    );
}