import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/auth";
import StudentDashboard from "@/app/Components/Dashboard/StudentDashboard";

export default async function StudentDashboardPage() {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    redirect("/auth/login");
  }

  if (auth.user.role !== "student") {
    redirect("/dashboard");
  }

  return <StudentDashboard name={auth.user.name} />;
}
