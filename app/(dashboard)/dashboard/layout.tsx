import DashboardSidebar from "@/app/Components/Dashboard/DashboardSidebar";
import DashboardTopbar from "@/app/Components/Dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardSidebar />

      <div className="min-h-screen lg:pl-[260px]">
        <DashboardTopbar />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
