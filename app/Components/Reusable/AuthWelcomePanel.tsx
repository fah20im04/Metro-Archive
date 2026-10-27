"use client";

import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

interface AuthWelcomePanelProps {
  title: string;
  description: string;
  badgeText?: string;
  children?: ReactNode;
}

export default function AuthWelcomePanel({
  title,
  description,
  badgeText = "University Portal Live",
  children,
}: AuthWelcomePanelProps) {
  return (
    <section className="relative flex h-full min-h-[580px] flex-col justify-between overflow-hidden bg-primary-dark p-8 text-white xl:p-10">
      {/* Decorative Ambient Background Elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/5" />

      {/* Top Header & Brand */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <GraduationCap size={26} />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Campus<span className="text-blue-300">Vault</span>
          </span>
        </Link>

        {badgeText && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {badgeText}
          </span>
        )}
      </div>

      {/* Middle Content Section (Dynamic Props) */}
      <div className="relative z-10 my-auto py-6 space-y-6">
        <div className="space-y-3">
          <h1 className="max-w-md text-3xl font-extrabold leading-tight text-white xl:text-4xl">
            {title}
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-blue-100/80">
            {description}
          </p>
        </div>

        {/* Custom Highlights & Feature Cards Slot */}
        {children}
      </div>

      {/* Footer Badge */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-blue-100/80">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-300" />
          <span>Official Student Gateway</span>
        </div>
        <span className="text-[11px] text-blue-100/60">v2.4</span>
      </div>
    </section>
  );
}
