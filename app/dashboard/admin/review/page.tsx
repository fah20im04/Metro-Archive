import { redirect } from "next/navigation";

import { getCurrentUserAction } from "@/actions/auth";
import { getAdminFacultyReviewsAction } from "@/actions/admin";

import FacultyReviewManagement from "@/app/Components/Dashboard/admin/FacultyReviewManagement";

export default async function AdminReviewsPage() {
  const auth = await getCurrentUserAction();

  if (!auth.success || !auth.user) {
    redirect("/auth/login");
  }

  if (auth.user.role !== "admin") {
    redirect("/dashboard");
  }

  const result = await getAdminFacultyReviewsAction();

  return (
    <FacultyReviewManagement
      initialReviews={result.success ? result.reviews : []}
    />
  );
}
