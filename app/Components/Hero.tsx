"use client";

import React from "react";
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
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background transition-colors duration-200">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-light/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-accent-light/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">
        {/* Hero Content */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3.5 py-2 text-sm font-medium text-primary">
            <ShieldCheck size={16} />
            Your university resource hub
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your academic journey,
            <span className="text-primary"> all in one place.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Discover semester-wise archives, previous question papers, shared
            study notes, and faculty feedback — all in one community built for
            students.
          </p>

          {/* Search bar */}
          <form
            action="/search"
            method="GET"
            className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-border bg-surface p-2 shadow-lg shadow-black/5 transition-colors duration-200"
          >
            <Search className="ml-2 shrink-0 text-muted-foreground" size={21} />

            <input
              type="search"
              name="q"
              placeholder="Search notes, courses, question papers..."
              aria-label="Search academic resources"
              className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none"
            />

            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Search
            </button>
          </form>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-dark px-5 py-3.5 text-sm font-semibold !text-white transition hover:bg-primary-hover"
            >
              Explore Archives <ArrowRight size={17} />
            </Link>

            <Link
              href="/question-bank"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <FileText size={17} />
              Question Bank
            </Link>
          </div>

          {/* Community indicator */}
          <div className="mt-9 flex items-center gap-3 text-sm text-muted">
            <div className="flex -space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary-light text-primary">
                <Users size={15} />
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-accent-light text-accent">
                <BookOpen size={15} />
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary-light text-primary">
                <GraduationCap size={15} />
              </div>
            </div>

            <span>Built for students, powered by shared knowledge.</span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-primary-light via-surface to-accent-light blur-xl" />

          <div className="relative rounded-3xl border border-border bg-surface p-5 shadow-2xl shadow-black/10 transition-colors duration-200 sm:p-7">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <p className="text-sm text-muted">Welcome to</p>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  Your study space
                </h2>
              </div>

              <div className="rounded-xl bg-primary-light p-3 text-primary">
                <GraduationCap size={25} />
              </div>
            </div>

            {/* Semester archive */}
            <div className="mt-6 rounded-2xl bg-surface-secondary p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Semester Archive
                  </p>

                  <p className="mt-1 text-xs text-muted">CSE · Semester 3.3</p>
                </div>

                <span className="rounded-lg bg-success-light px-2.5 py-1 text-xs font-semibold text-success">
                  Available
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>

              <p className="mt-2 text-xs text-muted">
                Notes, resources and previous questions
              </p>
            </div>

            {/* Feature cards */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-200">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light text-accent">
                  <FileText size={20} />
                </div>

                <p className="text-sm font-semibold text-foreground">
                  Question Bank
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Past papers across batches
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-200">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Star size={20} />
                </div>

                <p className="text-sm font-semibold text-foreground">
                  Faculty Reviews
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Student feedback and ratings
                </p>
              </div>
            </div>

            {/* Community callout */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-light/70 p-4">
              <div className="rounded-xl bg-surface p-2.5 text-primary shadow-sm">
                <Users size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Learn together
                </p>

                <p className="mt-1 text-xs text-muted">
                  Share knowledge with your university community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
