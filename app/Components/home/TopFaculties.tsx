import Link from "next/link";
import { ArrowUpRight, Heart, Trophy } from "lucide-react";

interface TopFaculty {
    id: string;
    name: string;
    designation: string;
    department: string;
    upvoteCount: number;
}

// Sample data (front-end only). Replace with real faculty data later;
// the component sorts by upvoteCount, so the order here doesn't matter.
const sampleFaculties: TopFaculty[] = [
    {
        id: "1",
        name: "Dr. Sample Faculty One",
        designation: "Professor",
        department: "CSE",
        upvoteCount: 128,
    },
    {
        id: "2",
        name: "Sample Faculty Two",
        designation: "Associate Professor",
        department: "EEE",
        upvoteCount: 96,
    },
    {
        id: "3",
        name: "Sample Faculty Three",
        designation: "Assistant Professor",
        department: "BBA",
        upvoteCount: 74,
    },
    {
        id: "4",
        name: "Sample Faculty Four",
        designation: "Lecturer",
        department: "CSE",
        upvoteCount: 41,
    },
];

// Styling for each rank (1st gets the accent color, 2nd and 3rd the primary)
const rankStyles = [
    {
        badge: "bg-accent text-white",
        card: "border-accent/40 md:order-2 md:-translate-y-4",
    },
    {
        badge: "bg-primary-light text-primary",
        card: "border-border/80 md:order-1",
    },
    {
        badge: "bg-primary-light text-primary",
        card: "border-border/80 md:order-3",
    },
];

function getInitials(name: string) {
    return name
        .replace(/^Dr\.?\s+/i, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

interface TopFacultiesProps {
    faculties?: TopFaculty[];
}

const TopFaculties = ({ faculties = sampleFaculties }: TopFacultiesProps) => {
    // Rank by upvotes (highest first) and keep the top three
    const topThree = [...faculties]
        .sort((a, b) => b.upvoteCount - a.upvoteCount)
        .slice(0, 3);

    return (
        <section className="relative overflow-hidden bg-background px-5 py-24 transition-colors duration-200 sm:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
                        <Trophy size={14} className="text-accent" />
                        <span>Student Favorites</span>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Top rated <span className="text-primary">faculty.</span>
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                        The faculty members students appreciate the most, ranked by
                        upvotes.
                    </p>
                </div>

                {/* Ranking Cards */}
                <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">
                    {topThree.map((faculty, index) => {
                        const style = rankStyles[index];

                        return (
                            <Link
                                key={faculty.id}
                                href="/faculty"
                                className={`group relative block rounded-3xl border bg-surface/65 p-7 no-underline! backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface hover:shadow-xl hover:shadow-black/5 ${style.card}`}
                            >
                                {/* Rank + Department */}
                                <div className="flex items-start justify-between">
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold ${style.badge}`}
                                    >
                                        #{index + 1}
                                    </div>

                                    <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted">
                                        {faculty.department}
                                    </span>
                                </div>

                                {/* Avatar + Details */}
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary">
                                        {getInitials(faculty.name)}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
                                            {faculty.name}
                                        </h3>

                                        <p className="truncate text-sm text-muted">
                                            {faculty.designation}
                                        </p>
                                    </div>
                                </div>

                                {/* Upvotes */}
                                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                        <Heart
                                            size={17}
                                            className="text-red-500"
                                            fill="currentColor"
                                        />
                                        {faculty.upvoteCount}
                                        <span className="font-normal text-muted">upvotes</span>
                                    </div>

                                    <ArrowUpRight
                                        size={18}
                                        className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All */}
                <div className="mt-10 flex justify-center">
                    <Link
                        href="/faculty"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline!"
                    >
                        View all faculty
                        <span aria-hidden>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TopFaculties;