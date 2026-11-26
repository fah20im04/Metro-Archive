import Link from "next/link";
import { FileText, Medal } from "lucide-react";

interface TopContributor {
    id: string;
    name: string;
    department: string;
    batch: string;
    contributionCount: number;
}

// Sample data (front-end only). Replace with real student data later;
// the component sorts by contributionCount, so the order here doesn't matter.
const sampleContributors: TopContributor[] = [
    {
        id: "1",
        name: "Sample Student One",
        department: "CSE",
        batch: "60",
        contributionCount: 42,
    },
    {
        id: "2",
        name: "Sample Student Two",
        department: "EEE",
        batch: "59",
        contributionCount: 35,
    },
    {
        id: "3",
        name: "Sample Student Three",
        department: "BBA",
        batch: "61",
        contributionCount: 27,
    },
    {
        id: "4",
        name: "Sample Student Four",
        department: "CSE",
        batch: "58",
        contributionCount: 12,
    },
];

// 1st gets the accent color, 2nd and 3rd the primary
const rankBadgeStyles = [
    "bg-accent text-white",
    "bg-primary-light text-primary",
    "bg-primary-light text-primary",
];

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

interface TopContributorsProps {
    contributors?: TopContributor[];
}

const TopContributors = ({
    contributors = sampleContributors,
}: TopContributorsProps) => {
    // Rank by contributions (highest first) and keep the top three
    const topThree = [...contributors]
        .sort((a, b) => b.contributionCount - a.contributionCount)
        .slice(0, 3);

    // The top contributor's count is the 100% mark for the progress bars
    const maxCount = topThree[0]?.contributionCount || 1;

    return (
        <section className="relative overflow-hidden bg-background px-5 py-24 transition-colors duration-200 sm:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
                        <Medal size={14} className="text-accent" />
                        <span>Community Leaders</span>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Top <span className="text-primary">contributors.</span>
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                        Students who share the most notes, question papers and resources
                        with everyone.
                    </p>
                </div>

                {/* Leaderboard */}
                <ol className="mt-14 space-y-4">
                    {topThree.map((student, index) => (
                        <li
                            key={student.id}
                            className="flex items-center gap-4 rounded-2xl border border-border/80 bg-surface/65 p-4 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-surface hover:shadow-lg hover:shadow-black/5 sm:gap-5 sm:p-5"
                        >
                            {/* Rank */}
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${rankBadgeStyles[index]}`}
                            >
                                {index + 1}
                            </div>

                            {/* Avatar */}
                            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-primary sm:flex">
                                {getInitials(student.name)}
                            </div>

                            {/* Details + progress */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-bold tracking-tight text-foreground">
                                            {student.name}
                                        </h3>

                                        <p className="truncate text-xs text-muted">
                                            {student.department} · Batch {student.batch}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                                        <FileText size={16} className="text-primary" />
                                        {student.contributionCount}
                                        <span className="hidden font-normal text-muted sm:inline">
                                            contributions
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-secondary">
                                    <div
                                        className="h-full rounded-full bg-primary"
                                        style={{
                                            width: `${(student.contributionCount / maxCount) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>

                {/* Browse */}
                <div className="mt-10 flex justify-center">
                    <Link
                        href="/archives"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline!"
                    >
                        Browse shared resources
                        <span aria-hidden>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TopContributors;