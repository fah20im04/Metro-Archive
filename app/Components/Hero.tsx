import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Search,
  Star,
} from "lucide-react";
import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden bg-background transition-colors duration-200">
      {/* Keep HeroBackground untouched */}
      <HeroBackground />

      {/* Subtle radial & edge vignette so the background illustration shines clearly */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-background via-background/5 to-background/10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--color-background)_0%,transparent_75%)] opacity-75" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-24 text-center sm:px-8">
        {/* Minimalist Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/65 px-4 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
          <GraduationCap size={15} className="text-primary" />
          <span>University Resource Hub</span>
        </div>

        {/* Clean, Refined Typography */}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Your academic journey,{" "}
          <span className="text-primary">all in one place.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
          Semester archives, past question papers, shared notes, and faculty
          insights — curated by students, for students.
        </p>

        {/* Lightweight Glass Dock for Core Sections */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/archives"
            className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/65 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md transition hover:border-primary/40 hover:bg-surface/90 hover:text-primary"
          >
            <BookOpen size={15} className="text-primary" />
            <span>Semester Archives</span>
          </Link>

          <Link
            href="/questionBank"
            className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/65 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md transition hover:border-primary/40 hover:bg-surface/90 hover:text-primary"
          >
            <FileText size={15} className="text-accent" />
            <span>Question Bank</span>
          </Link>

          <Link
            href="/faculty"
            className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/65 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md transition hover:border-primary/40 hover:bg-surface/90 hover:text-primary"
          >
            <Star size={15} className="text-primary" />
            <span>Faculty Reviews</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
