import Link from "next/link";
import { ArrowUpRight, Heart, Trophy } from "lucide-react";

import { getTopFacultiesAction } from "@/actions/faculty";
import Image from "next/image";

interface TopFaculty {
  id: string;
  name: string;
  designation: string;
  department: string;
  upvoteCount: number;
  profileImage: string;
}

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

const TopFaculties = async () => {
  const result = await getTopFacultiesAction();

  const faculties: TopFaculty[] = result.success ? result.faculties : [];

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
            The faculty members students appreciate the most, ranked by upvotes.
          </p>
        </div>

        {/* Ranking Cards */}
        {faculties.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-end">
            {faculties.map((faculty, index) => {
              const style = rankStyles[index];

              return (
                <Link
                  key={faculty.id}
                  href={`/faculty/${faculty.id}`}
                  className={`group relative block overflow-hidden rounded-3xl border bg-surface/65 no-underline! backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-surface hover:shadow-xl hover:shadow-black/5 ${style.card}`}
                >
                  {/* Top background */}
                  <div className="relative flex h-36 items-start justify-between bg-primary/5 px-6 pt-5">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold ${style.badge}`}
                    >
                      #{index + 1}
                    </div>

                    <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur-md">
                      {faculty.department}
                    </span>

                    {/* Decorative background */}
                    <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />
                  </div>

                  {/* Profile image */}
                  <div className="relative -mt-16 flex justify-center">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-surface bg-primary-light shadow-lg">
                      {faculty.profileImage ? (
                        <Image
                          src={faculty.profileImage}
                          alt={faculty.name}
                          width={128}
                          height={128}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
                          {getInitials(faculty.name)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Faculty Details */}
                  <div className="px-6 pb-6 pt-4 text-center">
                    <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
                      {faculty.name}
                    </h3>

                    <p className="mt-1 truncate text-sm text-muted">
                      {faculty.designation}
                    </p>

                    {/* Upvotes */}
                    <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10">
                        <Heart
                          size={17}
                          className="text-red-500"
                          fill="currentColor"
                        />
                      </div>

                      <div className="text-left">
                        <p className="text-base font-bold text-foreground">
                          {faculty.upvoteCount}
                        </p>
                        <p className="text-xs text-muted">Student upvotes</p>
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="ml-auto text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-border py-12 text-center">
            <Trophy className="mx-auto h-8 w-8 text-muted" />

            <h3 className="mt-3 font-semibold">
              No faculty rankings available yet
            </h3>

            <p className="mt-1 text-sm text-muted">
              Faculty rankings will appear as students upvote their favorite
              faculty members.
            </p>
          </div>
        )}

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
