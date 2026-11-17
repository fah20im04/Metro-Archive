import { Suspense } from "react";

import FacultyCardContainer from "@/app/Components/Faculty/FacultyCardContainer";
import { getFacultyAction } from "@/actions/faculty";

function FacultyLoading() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-xl border border-border bg-card"
        />
      ))}
    </div>
  );
}

async function FacultyContent() {
  const result = await getFacultyAction();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="font-medium">Unable to load faculty members.</p>

        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return <FacultyCardContainer faculty={result.faculty} />;
}

export default function FacultyPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-primary">
            University Directory
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Faculty Members
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Explore faculty profiles, academic backgrounds, and student
            feedback.
          </p>
        </div>

        {/* Faculty content */}
        <Suspense fallback={<FacultyLoading />}>
          <FacultyContent />
        </Suspense>
      </section>
    </main>
  );
}
