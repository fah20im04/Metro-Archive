import Link from "next/link";
import { FileText, Medal, Heart, Bookmark } from "lucide-react";

import { getTopContributorsAction } from "@/actions/contributor";

interface TopContributor {
  id: string;
  name: string;
  department: string;
  batch: string;
  contributionCount: number;
  likes: number;
  bookmarks: number;
  engagementScore: number;
}

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

const TopContributors = async () => {
  const result = await getTopContributorsAction();

  const topThree: TopContributor[] = result.success ? result.contributors : [];

  const maxScore = topThree[0]?.engagementScore || 1;

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
            Students making a difference by sharing valuable notes and resources
            with the university community.
          </p>
        </div>

        {/* Leaderboard */}
        {topThree.length > 0 ? (
          <ol className="mt-14 space-y-4">
            {topThree.map((student, index) => (
              <li
                key={student.id}
                className="flex items-center gap-4 rounded-2xl border border-border/80 bg-surface/65 p-4 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-surface hover:shadow-lg hover:shadow-black/5 sm:gap-5 sm:p-5"
              >
                {/* Rank */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                    rankBadgeStyles[index]
                  }`}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-primary sm:flex">
                  {getInitials(student.name)}
                </div>

                {/* Details */}
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

                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm font-semibold text-foreground">
                        <FileText size={15} className="text-primary" />
                        {student.contributionCount}
                      </div>
                      <span className="text-[11px] text-muted">
                        contributions
                      </span>
                    </div>
                  </div>

                  {/* Engagement stats */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-primary" />
                      {student.likes} likes
                    </span>

                    <span className="flex items-center gap-1">
                      <Bookmark size={14} className="text-primary" />
                      {student.bookmarks} bookmarks
                    </span>
                  </div>

                  {/* Engagement progress */}
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${(student.engagementScore / maxScore) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-14 rounded-2xl border border-border/80 bg-surface/65 px-6 py-12 text-center">
            <FileText size={32} className="mx-auto text-muted" />
            <h3 className="mt-4 font-semibold text-foreground">
              No contributors yet
            </h3>
            <p className="mt-2 text-sm text-muted">
              Be the first student to share useful resources with your
              university community.
            </p>
          </div>
        )}

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
