import { Suspense } from "react";

import Archives from "@/app/Components/Dashboard/archives/Archives";
import { getMyResourcesAction } from "@/actions/resource";

// Shown while the user's archives are loading
function ArchivesLoading() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="space-y-3">
                <div className="h-4 w-32 rounded bg-surface-secondary" />
                <div className="h-8 w-64 rounded bg-surface-secondary" />
                <div className="h-4 w-80 max-w-full rounded bg-surface-secondary" />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-56 rounded-xl border border-border bg-surface-secondary"
                    />
                ))}
            </div>
        </div>
    );
}

// Fetches the current user's uploads on the server,
// then hands them to the UI component
async function ArchivesContent() {
    const result = await getMyResourcesAction();

    return <Archives resources={result.resources ?? []} />;
}

export default function Page() {
    return (
        <Suspense fallback={<ArchivesLoading />}>
            <ArchivesContent />
        </Suspense>
    );
}