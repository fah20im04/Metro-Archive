interface StudentDashboardProps {
  name: string;
}

export default function StudentDashboard({ name }: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">STUDENT PORTAL</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome, {name}
        </h1>

        <p className="mt-2 text-sm text-muted">
          Manage your academic resources and explore your university archive.
        </p>
      </div>

      <div className="card rounded-xl p-6">
        <h2 className="text-lg font-semibold">Student Dashboard</h2>

        <p className="mt-2 text-sm text-muted">
          Your academic dashboard is ready.
        </p>
      </div>
    </div>
  );
}
