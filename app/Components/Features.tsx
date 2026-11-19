"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Star, LibraryBig } from "lucide-react";

const features = [
  {
    icon: LibraryBig,
    title: "Semester Archives",
    description:
      "Explore organized academic resources by department, semester, and batch.",
    label: "Browse archives",
    href: "/archives",
    color: "bg-primary-light text-primary",
  },
  {
    icon: FileText,
    title: "Previous Question Papers",
    description:
      "Prepare smarter with previous exam questions collected from different batches.",
    label: "Explore questions",
    href: "/question-bank",
    color: "bg-accent-light text-accent",
  },
  {
    icon: Star,
    title: "Faculty Feedback",
    description:
      "Discover student ratings and constructive reviews to make informed choices.",
    label: "View faculty",
    href: "/faculty",
    color: "bg-primary-light text-primary",
  },
  {
    icon: BookOpen,
    title: "Shared Study Notes",
    description:
      "Find helpful notes, study materials, and resources shared by fellow students.",
    label: "Find resources",
    href: "/resources",
    color: "bg-primary-light text-primary",
  },
];

const Features = () => {
  return (
    <section className="bg-[var(--surface-secondary)] px-5 py-20 transition-colors duration-200 sm:px-8">
      {" "}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Explore CampusVault
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to study smarter
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-muted">
              Spend less time searching for materials and more time learning
              with resources organized for your academic journey.
            </p>
          </div>

          <Link
            href="/resources"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
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
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-black/5"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 min-h-20 text-sm leading-6 text-muted">
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
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
  );
};

export default Features;
