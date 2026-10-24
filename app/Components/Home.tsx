import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Search,
  Star,
  Users,
  ShieldCheck,
  LibraryBig,
  Menu,
} from "lucide-react";

const features = [
  {
    icon: LibraryBig,
    title: "Semester Archives",
    description:
      "Explore organized academic resources by department, semester, and batch.",
    label: "Browse archives",
    href: "/archives",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    title: "Previous Question Papers",
    description:
      "Prepare smarter with previous exam questions collected from different batches.",
    label: "Explore questions",
    href: "/question-bank",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Star,
    title: "Faculty Feedback",
    description:
      "Discover student ratings and constructive reviews to make informed choices.",
    label: "View faculty",
    href: "/faculty",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BookOpen,
    title: "Shared Study Notes",
    description:
      "Find helpful notes, study materials, and resources shared by fellow students.",
    label: "Find resources",
    href: "/resources",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              MU<span className="text-blue-600">Archive</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-semibold text-blue-600">
              Home
            </Link>
            <Link
              href="/archives"
              className="text-sm text-slate-600 transition hover:text-blue-600"
            >
              Archives
            </Link>
            <Link
              href="/question-bank"
              className="text-sm text-slate-600 transition hover:text-blue-600"
            >
              Question Bank
            </Link>
            <Link
              href="/faculty"
              className="text-sm text-slate-600 transition hover:text-blue-600"
            >
              Faculty
            </Link>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700">
              <ShieldCheck size={16} />
              Your university resource hub
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your academic journey,
              <span className="text-blue-600"> all in one place.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover semester-wise archives, previous question papers, shared
              study notes, and faculty feedback — all in one community built for
              students.
            </p>

            {/* Search bar */}
            <form
              action="/search"
              method="GET"
              className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50"
            >
              <Search className="ml-2 shrink-0 text-slate-400" size={21} />
              <input
                type="search"
                name="q"
                placeholder="Search notes, courses, question papers..."
                aria-label="Search academic resources"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/archives"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Explore Archives <ArrowRight size={17} />
              </Link>
              <Link
                href="/question-bank"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                <FileText size={17} /> Question Bank
              </Link>
            </div>

            <div className="mt-9 flex items-center gap-3 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-blue-700">
                  <Users size={15} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-orange-700">
                  <BookOpen size={15} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-emerald-700">
                  <GraduationCap size={15} />
                </div>
              </div>
              <span>Built for students, powered by shared knowledge.</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-100 via-white to-orange-100 blur-xl" />

            <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm text-slate-500">Welcome to</p>
                  <h2 className="mt-1 text-xl font-bold">Your study space</h2>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <GraduationCap size={25} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Semester Archive
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      CSE · Semester 3.3
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Available
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-3/4 rounded-full bg-blue-600" />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Notes, resources and previous questions
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <FileText size={20} />
                  </div>
                  <p className="text-sm font-semibold">Question Bank</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Past papers across batches
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Star size={20} />
                  </div>
                  <p className="text-sm font-semibold">Faculty Reviews</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Student feedback and ratings
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Learn together
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Share knowledge with your university community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore features */}
      <section className="bg-slate-50/70 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Explore CampusVault
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to study smarter
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Spend less time searching for materials and more time learning
                with resources organized for your academic journey.
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Explore resources <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>

                  <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    {feature.label}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={22} />
            <span className="font-bold">
              Campus<span className="text-blue-600">Vault</span>
            </span>
          </Link>
          <p className="text-center text-sm text-slate-500">
            A better way to share knowledge and learn together.
          </p>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} CampusVault
          </p>
        </div>
      </footer>
    </main>
  );
}
