import NavbarClient, { type CurrentUser } from "./NavbarClient";
import { getCurrentUserAction } from "@/actions/auth";

export default async function Navbar() {
  let currentUser: CurrentUser | null = null;

  try {
    const result = await getCurrentUserAction();

    if (result.success && result.user) {
      currentUser = result.user as CurrentUser;
    }
  } catch (error) {
    console.error("Navbar authentication error:", error);
  }

  return <NavbarClient currentUser={currentUser} />;
}
