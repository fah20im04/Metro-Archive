import Link from "next/link";
import {
  Bookmark,
  Check,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

// What the platform offers
const features = [
  {
    icon: LibraryBig,
    title: "Archives",
    description:
      "Notes, assignments and lab reports shared by students, organized by course and department.",
    points: [
      "Resources are shared as Google Drive links",
      "Like and bookmark what helps you",
    ],
  },
  {
    icon: FileText,
    title: "Question Bank",
    description:
      "Past midterm and final papers from different courses, so you know what to expect.",
    points: [
      "Search by course or department",
      "Upload papers from your own batch",
    ],
  },
  {
    icon: Star,
    title: "Faculty Reviews",
    description:
      "A faculty directory where students upvote their favorites and leave written reviews.",
    points: [
      "One upvote per student per faculty member",
      "Reviews go live after an admin approves them",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "Your Dashboard",
    description:
      "A personal space to keep track of everything you have saved and shared.",
    points: [
      "Your uploads, bookmarks and contributions",
      "Account settings in one place",
    ],
  },
];

// How someone uses it, step by step
const steps = [
  {
    title: "Register with your university ID",
    description: "Sign up once with your university ID and email.",
  },
  {
    title: "Find what you need",
    description: "Browse archives and question papers, or look up a faculty member.",
  },
  {
    title: "Share what you have",
    description: "Add a Drive link for your notes or a past paper for others.",
  },
  {
    title: "Keep the best",
    description: "Like and bookmark resources. Top contributors show up on the home page.",
  },
];

// Who uses it
const roles = [
  {
    icon: GraduationCap,
    title: "Students",
    points: [
      "Upload resources and question papers",
      "Like, bookmark and review",
      "Get ranked as a top contributor",
    ],
  },
  {
    icon: Users,
    title: "Faculty",
    points: [
      "Listed in the faculty directory",
      "Rated through student upvotes",
      "Reviewed by students",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    points: [
      "Approve or reject faculty reviews",
      "Manage user accounts",
      "Keep the archive clean",
    ],
  },
];

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "MongoDB",
  "Mongoose",
];

const AboutUsDetails = () => {
  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-primary/5 blur-3xl" />

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
            <GraduationCap size={14} className="text-primary" />
            <span>About MUArchive</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Study resources for Metropolitan University,{" "}
            <span className="text-primary">kept in one place.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Notes end up in <span className="text-primary">scattered drives and old chat groups.</span> MUArchive 
            <span className="text-primary"> collects</span> them on one site, organized by course and department, so
            the <span className="text-primary">next batch doesn&apos;t start from zero.</span> It began as our web
            course project and is built entirely by students.
          </p>
        </div>
      </section>

      {/* What's inside */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            What&apos;s inside
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border/80 bg-surface/65 p-6 transition hover:border-primary/40 hover:bg-surface"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {feature.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-primary"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>

          <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border/80 bg-surface/65 p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>

                <h3 className="mt-4 font-bold tracking-tight">{step.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Who it&apos;s for
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.title}
                  className="rounded-2xl border border-border/80 bg-surface/65 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light text-accent">
                      <Icon size={20} />
                    </div>

                    <h3 className="text-lg font-bold tracking-tight">
                      {role.title}
                    </h3>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech + CTA */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-border/80 bg-surface/65 p-8 sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Bookmark size={16} />
                Built with
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-sm font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/archives"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white! no-underline! transition hover:bg-primary-hover"
            >
              Browse archives
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUsDetails;
