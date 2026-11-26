import { getAdminUsersAction } from "@/actions/admin";
import UserManagement from "@/app/Components/Dashboard/admin/UserManagement";

export default async function UsersPage() {
  const result = await getAdminUsersAction({
    page: 1,
    limit: 10,
    search: "",
    role: "all",
    status: "all",
    department: "all",
  });

  const initialUsers = result.success ? result.users : [];

  const initialPagination =
    result.success && result.pagination
      ? result.pagination
      : {
          currentPage: 1,
          limit: 10,
          totalUsers: 0,
          totalPages: 0,
        };

  return (
    <UserManagement
      initialUsers={initialUsers}
      initialPagination={initialPagination}
    />
  );
}
