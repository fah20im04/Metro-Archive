import { Suspense } from "react";
import { redirect } from "next/navigation";

import Settings from "@/app/Components/Dashboard/settings/Settings";
import { getCurrentUserAction } from "@/actions/auth";

// Shown while the user is loading
function SettingsLoading() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-surface-secondary" />
                <div className="h-8 w-48 rounded bg-surface-secondary" />
                <div className="h-4 w-72 max-w-full rounded bg-surface-secondary" />
            </div>

            <div className="h-48 rounded-xl border border-border bg-surface-secondary" />
            <div className="h-40 rounded-xl border border-border bg-surface-secondary" />
            <div className="h-72 rounded-xl border border-border bg-surface-secondary" />
        </div>
    );
}

// Checks the user's role on the server, then hands the user to the UI
async function SettingsContent() {
    const auth = await getCurrentUserAction();

    if (!auth.success || !auth.user) {
        redirect("/auth/login");
    }

    const user = auth.user;

    // Settings is shared by every dashboard role
    if (
        user.role !== "student" &&
        user.role !== "faculty" &&
        user.role !== "admin"
    ) {
        redirect("/auth/login");
    }

    return <Settings user={user} />;
}

export default function Page() {
    return (
        <Suspense fallback={<SettingsLoading />}>
            <SettingsContent />
        </Suspense>
    );
}