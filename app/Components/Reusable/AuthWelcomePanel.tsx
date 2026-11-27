"use client";

import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import type { ReactNode } from "react";

interface AuthWelcomePanelProps {
  title: string;
  description: string;
  badgeText?: string;
  children?: ReactNode;
  compact?: boolean;
}

export default function AuthWelcomePanel({
  title,
  description,
  badgeText = "University Portal",
  children,
  compact = false,
}: AuthWelcomePanelProps) {
  return (
    <section className="relative flex h-full min-h-[580px] flex-col justify-between overflow-hidden rounded-l-2xl bg-primary-dark p-7 text-white sm:p-9 xl:p-11">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />

        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

        <div className="absolute right-12 top-1/3 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/10" />
      </div>

      {/* Brand header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="CampusVault home"
          className="group inline-flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:bg-white/15">
            <GraduationCap size={27} strokeWidth={1.8} />
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight">
              Campus<span className="text-blue-300">Vault</span>
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-blue-100/60">
              Your campus, organized
            </p>
          </div>
        </Link>

        {badgeText && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-xs font-medium text-blue-50/90">
              {badgeText}
            </span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`relative z-10 ${compact ? "my-0" : "my-auto py-12"}`}>
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-blue-200/15 bg-blue-300/10 px-3 py-2 text-xs font-medium text-blue-100">
          <Sparkles size={14} />
          <span>Everything in one place</span>
        </div>

        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl xl:text-[42px]">
            {title}
          </h1>

          <p className="max-w-sm text-sm leading-7 text-blue-100/75 sm:text-base">
            {description}
          </p>
        </div>

        {/* Login/register-specific content */}
        {children && <div className="mt-8 max-w-md">{children}</div>}

        {/* Small visual accent */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-1 w-10 rounded-full bg-blue-300" />
          <div className="h-1 w-3 rounded-full bg-white/30" />
          <div className="h-1 w-3 rounded-full bg-white/15" />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
            <ShieldCheck size={17} className="text-emerald-300" />
          </div>

          <div>
            <p className="text-xs font-semibold text-white/90">
              Your campus, your community
            </p>
            <p className="mt-1 text-[11px] text-blue-100/55">
              A trusted university resource hub
            </p>
          </div>
        </div>

        <Link
          href="/"
          aria-label="Visit CampusVault home"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
        >
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
