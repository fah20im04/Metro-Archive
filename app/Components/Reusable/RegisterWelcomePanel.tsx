"use client";

import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  FileText,
  Users,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface RegisterWelcomePanelProps {
  title: string;
  description: string;
  badgeText?: string;
  children?: React.ReactNode;
}

export default function RegisterWelcomePanel({
  title,
  description,
  badgeText = "Join CampusVault",
  children,
}: RegisterWelcomePanelProps) {
  return (
    <section className="relative flex h-full min-h-[580px] flex-col rounded-l-2xl overflow-hidden bg-primary-dark p-6 text-white sm:p-8 xl:p-9">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 transition group-hover:bg-white/15">
            <GraduationCap size={23} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">
              Campus<span className="text-blue-300">Vault</span>
            </p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-blue-100/60">
              Your campus, organized
            </p>
          </div>
        </Link>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-medium text-blue-50/90">
          <Sparkles size={12} className="text-blue-300" />
          {badgeText}
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 mt-9">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
          Your next chapter
        </p>

        <h1 className="max-w-sm text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100/75">
          {description}
        </p>
      </div>

      {/* Academic resource preview */}
      <div className="relative z-10 mt-7 rounded-2xl border border-white/15 bg-white/[0.07] p-4 shadow-xl shadow-black/10 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white">
              Your academic space
            </p>
            <p className="mt-1 text-[11px] text-blue-100/60">
              Everything you need, together
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-300/10 text-blue-200">
            <BookOpen size={19} />
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/[0.08] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-400/15 text-blue-200">
              <FileText size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white">
                Notes & question papers
              </p>
              <p className="mt-1 text-[10px] text-blue-100/60">
                Find materials for your courses
              </p>
            </div>
            <ArrowUpRight size={15} className="text-blue-200/70" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/[0.08] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
              <Users size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white">
                A connected community
              </p>
              <p className="mt-1 text-[10px] text-blue-100/60">
                Learn and share with fellow students
              </p>
            </div>
            <ArrowUpRight size={15} className="text-blue-200/70" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
          <CheckCircle2 size={15} className="text-emerald-300" />
          <p className="text-[11px] text-blue-100/75">
            Built around your university experience
          </p>
        </div>
      </div>

      {/* Optional custom content */}
      {children && <div className="relative z-10 mt-4">{children}</div>}

      {/* Bottom benefits */}
      <div className="relative z-10 mt-auto pt-7">
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <div>
            <ShieldCheck size={17} className="mb-2 text-emerald-300" />
            <p className="text-[10px] font-semibold text-white">
              Student focused
            </p>
          </div>

          <div>
            <BookOpen size={17} className="mb-2 text-blue-200" />
            <p className="text-[10px] font-semibold text-white">
              Academic resources
            </p>
          </div>

          <div>
            <Users size={17} className="mb-2 text-blue-200" />
            <p className="text-[10px] font-semibold text-white">
              Campus community
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 text-xs text-blue-100/60 transition hover:text-white"
        >
          <span>CampusVault</span>
          <span>·</span>
          <span>Your campus, organized</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </section>
  );
}
