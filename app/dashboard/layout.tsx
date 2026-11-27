import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCurrentUserAction } from "@/actions/auth";

import DashboardSidebar from "@/app/Components/Dashboard/DashboardSidebar";
import DashboardTopbar from "@/app/Components/Dashboard/DashboardTopbar";

async function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    redirect("/auth/login");
  }

  const user = auth.user;

  if (
    user.role !== "student" &&
    user.role !== "faculty" &&
    user.role !== "admin"
  ) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardSidebar role={user.role} />

      <div className="min-h-screen lg:pl-65">
        <DashboardTopbar user={user} />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
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
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}
