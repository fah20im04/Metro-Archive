import { Suspense } from "react";

import Archive from "@/app/Components/archive/Archive";
import { getArchivesAction } from "@/actions/archive";
import { getCurrentUserAction } from "@/actions/auth";

function ArchivesLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 h-24 rounded-xl bg-surface-secondary" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 rounded-xl border border-border bg-surface-secondary"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

async function ArchiveContent() {
  const [result, auth] = await Promise.all([
    getArchivesAction(),
    getCurrentUserAction(),
  ]);

  return (
    <Archive
      archives={result.archives}
      stats={result.stats}
      isLoggedIn={auth.success}
    />
  );
}

const page = () => {
  return (
    <Suspense fallback={<ArchivesLoading />}>
      <ArchiveContent />
    </Suspense>
  );
};

export default page;
