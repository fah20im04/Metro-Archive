import {
  BookOpen,
  Bookmark,
  FileText,
  GraduationCap,
  ArrowUpRight,
  Clock,
  Plus,
  Search,
  FolderOpen,
} from "lucide-react";

const stats = [
  {
    title: "My Resources",
    value: "12",
    description: "Resources contributed",
    icon: FileText,
  },
  {
    title: "Bookmarks",
    value: "08",
    description: "Saved for later",
    icon: Bookmark,
  },
  {
    title: "Contributions",
    value: "05",
    description: "Total contributions",
    icon: BookOpen,
  },
  {
    title: "Upvotes Received",
    value: "23",
    description: "From the community",
    icon: GraduationCap,
  },
];

const activities = [
  {
    title: "Data Structures and Algorithms",
    category: "Lecture Notes",
    date: "Recently uploaded",
    status: "Approved",
  },
  {
    title: "Database Management System",
    category: "Lab Report",
    date: "Recently updated",
    status: "Pending",
  },
  {
    title: "Computer Networks",
    category: "Question Paper",
    date: "2 days ago",
    status: "Approved",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard Overview</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, Fahim!
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage your academic resources and contributions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-surface-secondary">
            <Search size={17} />
            Explore Archive
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">
            <Plus size={17} />
            Add Resource
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-surface p-5 transition hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Icon size={21} />
                </div>

                <ArrowUpRight size={18} className="text-muted" />
              </div>

              <div className="mt-5">
                <p className="text-sm text-muted">{stat.title}</p>

                <h2 className="mt-1 text-2xl font-bold">{stat.value}</h2>

                <p className="mt-1 text-xs text-muted">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Dashboard Content */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Activity */}
        <div className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Recent Activity</h2>

              <p className="mt-1 text-sm text-muted">
                Your latest academic contributions.
              </p>
            </div>

            <button className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>

          <div className="divide-y divide-border">
            {activities.map((activity) => (
              <div
                key={activity.title}
                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <FileText size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">{activity.title}</h3>

                    <p className="mt-1 text-xs text-muted">
                      {activity.category} · {activity.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    activity.status === "Approved"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold">Quick Actions</h2>

            <p className="mt-1 text-sm text-muted">
              Access frequently used features.
            </p>
          </div>

          <div className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition hover:bg-surface-secondary">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Plus size={20} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Upload Resource</p>
                <p className="mt-1 text-xs text-muted">
                  Share notes and documents
                </p>
              </div>

              <ArrowUpRight size={17} className="text-muted" />
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition hover:bg-surface-secondary">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <FolderOpen size={20} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Browse Archives</p>
                <p className="mt-1 text-xs text-muted">
                  Find academic materials
                </p>
              </div>

              <ArrowUpRight size={17} className="text-muted" />
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition hover:bg-surface-secondary">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <GraduationCap size={20} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Faculty Directory</p>
                <p className="mt-1 text-xs text-muted">
                  Explore faculty profiles
                </p>
              </div>

              <ArrowUpRight size={17} className="text-muted" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Information */}
      <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Clock size={20} />
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              Keep your academic archive organized
            </h2>

            <p className="mt-1 text-sm text-muted">
              Contribute useful notes, previous questions, and lab reports to
              help your university community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
