import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/auth";

export default async function AdminDashboardPage() {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    redirect("/auth/login");
  }

  if (auth.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">
          ADMINISTRATION PORTAL
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome, {auth.user.name}
        </h1>

        <p className="mt-2 text-sm text-muted">
          Manage university resources, students, faculty, and platform
          activities.
        </p>
      </div>

      {/* Admin dashboard content will go here */}
      <div className="card rounded-xl p-6">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>

        <p className="mt-2 text-sm text-muted">
          Your administration dashboard is ready.
        </p>
      </div>
    </div>
  );
}
