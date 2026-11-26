import { BarChart3 } from "lucide-react";

export const tooltipStyle = {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--foreground)",
};

export const axisTick = { fill: "var(--muted)", fontSize: 12 };

export function ChartCard({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>

            <div className="mt-5">{children}</div>
        </div>
    );
}

export function EmptyChart() {
    return (
        <div className="flex h-60 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-muted">
                <BarChart3 size={23} />
            </div>

            <p className="mt-3 text-sm font-semibold text-foreground">
                No data to show
            </p>

            <p className="mt-1 text-xs text-muted">Try changing your filters.</p>
        </div>
    );
}