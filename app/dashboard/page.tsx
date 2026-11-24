import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/auth";

export default async function DashboardPage() {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    redirect("/auth/login");
  }

  if (auth.user.role === "student") {
    redirect("/dashboard/student");
  }

  if (auth.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/auth/login");
}
