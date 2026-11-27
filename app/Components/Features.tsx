"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  LibraryBig,
  Sparkles,
  Star,
} from "lucide-react";

const features = [
  {
    icon: LibraryBig,
    tag: "Structured by Batch",
    title: "Semester Archives",
    description:
      "Navigate cleanly organized course repositories sorted by department, semester, and batch.",
    label: "Browse archives",
    href: "/archives",
    span: "md:col-span-7",
    accentClass: "text-primary bg-primary-light/70",
  },
  {
    icon: FileText,
    tag: "Exam Ready",
    title: "Question Bank",
    description:
      "Review past midterm and final exam papers from previous batches to spot patterns early.",
    label: "Explore papers",
    href: "/question-bank",
    span: "md:col-span-5",
    accentClass: "text-accent bg-accent-light/70",
  },
  {
    icon: Star,
    tag: "Peer Insights",
    title: "Faculty Reviews",
    description:
      "Read honest student feedback, teaching styles, and course ratings before registration.",
    label: "Meet faculty",
    href: "/faculty",
    span: "md:col-span-5",
    accentClass: "text-accent bg-accent-light/70",
  },
  {
    icon: BookOpen,
    tag: "Community Curated",
    title: "Shared Study Notes",
    description:
      "Access handwritten notes, slide summaries, and peer-contributed guides across subjects.",
    label: "Find resources",
    href: "/resources",
    span: "md:col-span-7",
    accentClass: "text-primary bg-primary-light/70",
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-background px-5 py-24 transition-colors duration-200 sm:px-8">
      {/* Subtle ambient glow matching the Hero aesthetic */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        {/* Centered Editorial Header matching Hero */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
            <Sparkles size={14} className="text-primary" />
            <span>Explore MUArchive</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="text-primary">study smarter.</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Less time digging through scattered drives—more time learning with
            resources built around your academic journey.
          </p>
        </div>

        {/* Asymmetric Editorial Bento Grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-surface/65 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface hover:shadow-xl hover:shadow-black/5 sm:p-8 ${feature.span}`}
              >
                {/* Top row: Icon + Pill Tag + Corner Arrow */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${feature.accentClass}`}
                      >
                        <Icon size={21} />
                      </div>

                      <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted">
                        {feature.tag}
                      </span>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-muted transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-white">
                      <ArrowUpRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-7 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Bottom Action Link */}
                <div className="mt-8 flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <span>{feature.label}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
