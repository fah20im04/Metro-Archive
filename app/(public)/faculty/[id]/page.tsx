import { Suspense } from "react";
import FacultyDetailsContent from "./FacultyDetailsContent";

function FacultyDetailsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6">
        <div className="h-5 w-32 rounded bg-muted" />

        <div className="mt-8 rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="h-28 w-28 rounded-full bg-muted" />

            <div className="flex-1 space-y-3">
              <div className="h-7 w-56 rounded bg-muted" />
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-4 w-64 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FacultyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<FacultyDetailsLoading />}>
      <FacultyDetailsContent params={params} />
    </Suspense>
  );
}
