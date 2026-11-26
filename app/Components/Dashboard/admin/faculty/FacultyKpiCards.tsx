import {
    Clock,
    MessageSquare,
    ThumbsUp,
    UserCheck,
    UserX,
    Users,
} from "lucide-react";

interface FacultyKpiCardsProps {
    stats: {
        totalFaculty: number;
        activeFaculty: number;
        inactiveFaculty: number;
        totalUpvotes: number;
        pendingReviews: number;
        totalReviews: number;
    };
}

export default function FacultyKpiCards({ stats }: FacultyKpiCardsProps) {
    const cards = [
        {
            label: "Total faculty",
            value: stats.totalFaculty,
            hint: "All faculty profiles",
            icon: Users,
            color: "bg-primary/10 text-primary",
        },
        {
            label: "Active profiles",
            value: stats.activeFaculty,
            hint: "Visible to students",
            icon: UserCheck,
            color: "bg-emerald-500/10 text-emerald-600",
        },
        {
            label: "Inactive profiles",
            value: stats.inactiveFaculty,
            hint: "Hidden from students",
            icon: UserX,
            color: "bg-slate-500/10 text-slate-600",
        },
        {
            label: "Total upvotes",
            value: stats.totalUpvotes,
            hint: "Across all faculty",
            icon: ThumbsUp,
            color: "bg-blue-500/10 text-blue-600",
        },
        {
            label: "Total reviews",
            value: stats.totalReviews,
            hint: "All submitted reviews",
            icon: MessageSquare,
            color: "bg-violet-500/10 text-violet-600",
        },
        {
            label: "Pending reviews",
            value: stats.pendingReviews,
            hint: "Waiting for moderation",
            icon: Clock,
            color: "bg-amber-500/10 text-amber-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ label, value, hint, icon: Icon, color }) => (
                <div
                    key={label}
                    className="rounded-2xl border border-border bg-surface p-5"
                >
                    <div className="flex items-center justify-between">
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
                        >
                            <Icon size={21} />
                        </div>

                        <span className="text-xs font-medium text-muted">{label}</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-foreground">{value}</h3>

                    <p className="mt-1 text-sm text-muted">{hint}</p>
                </div>
            ))}
        </div>
    );
}