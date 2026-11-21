import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCurrentUserAction } from "@/actions/auth";
import DashboardSidebar from "@/app/Components/Dashboard/DashboardSidebar";
import DashboardTopbar from "@/app/Components/Dashboard/DashboardTopbar";

// Redirects to the login page unless the user has a valid, active session.
// Reading the session cookie happens at request time, so this runs
// inside <Suspense> (required by cacheComponents).
async function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-muted">
          Loading...
        </div>
      }
    >
      <AuthGate>
        <div className="min-h-screen bg-background text-foreground">
          <DashboardSidebar />

          <div className="min-h-screen lg:pl-[260px]">
            <DashboardTopbar />

            <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </AuthGate>
    </Suspense>
  );
}