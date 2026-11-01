"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AuthWelcomePanel from "@/app/Components/Reusable/AuthWelcomePanel";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Replace this simulated request with your authentication API.
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8">
      {/* Subtle background decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary-light/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent-light/40 blur-3xl" />

      {/* Main login container */}
      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-black/5 lg:min-h-[680px] lg:grid-cols-2">
        {/* =====================================
            LEFT PANEL
        ====================================== */}
        <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
          {/* Existing reusable welcome panel */}
          <AuthWelcomePanel
            title="Your university life, all in one place."
            description="Everything you need to stay ahead academically. Discover lecture notes, explore previous exam papers, and learn alongside your university community."
          >
            {/* Resource preview */}
            <div className="mt-8 space-y-4">
              {/* Main resource card */}
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                      <BookOpen size={21} className="text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Your academic library
                      </p>

                      <p className="mt-1 text-xs text-white/65">
                        Everything within reach
                      </p>
                    </div>
                  </div>

                  <Sparkles size={19} className="text-white/80" />
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                      <BookOpen size={17} className="text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">
                        Semester Archives
                      </p>
                      <p className="mt-0.5 text-xs text-white/60">
                        Organized study materials
                      </p>
                    </div>

                    <ArrowRight size={16} className="text-white/70" />
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                      <GraduationCap size={19} className="text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">
                        Question Bank
                      </p>
                      <p className="mt-0.5 text-xs text-white/60">
                        Prepare with previous papers
                      </p>
                    </div>

                    <ArrowRight size={16} className="text-white/70" />
                  </div>
                </div>
              </div>

              {/* Trust indicator */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck size={21} className="text-white" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Your academic space
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/65">
                    One community. Shared knowledge. Better learning.
                  </p>
                </div>
              </div>
            </div>
          </AuthWelcomePanel>

          {/* Panel footer */}
          <p className="mt-8 text-xs text-white/60">
            Learn together. Achieve more.
          </p>
        </section>

        {/* =====================================
            RIGHT PANEL — LOGIN FORM
        ====================================== */}
        <section className="flex items-center justify-center bg-surface px-6 py-10 transition-colors duration-300 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            {/* Branding */}
            <Link href="/" className="mb-10 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-[var(--background)] shadow-md shadow-primary/20">
                <GraduationCap size={25} />
              </div>

              <span className="text-xl font-bold tracking-tight text-foreground">
                Campus<span className="text-primary">Vault</span>
              </span>
            </Link>

            {/* Welcome heading */}
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles size={14} />
                Your learning journey continues
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Welcome back<span className="text-primary">.</span>
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                Sign in to access your academic resources and pick up where you
                left off.
              </p>
            </div>

            {/* University ID sign-in */}
            <button
              type="button"
              className="group mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary px-4 py-3.5 text-sm font-semibold text-foreground transition duration-200 hover:border-primary/40 hover:bg-primary-light/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors group-hover:border-primary/30">
                <GraduationCap size={19} />
              </div>

              <span>Continue with University Edu ID</span>

              <ArrowRight
                size={16}
                className="ml-auto text-muted transition-transform group-hover:translate-x-1"
              />
            </button>

            {/* Divider */}
            <div className="relative mb-6 flex items-center">
              <div className="w-full border-t border-border" />

              <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Or continue with email
              </span>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  University email
                </label>

                <div className="group relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition duration-200 placeholder:text-muted-foreground hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground"
                  >
                    Password
                  </label>

                  <Link
                    href="/Auth/forgot-password"
                    className="text-xs font-semibold text-primary transition hover:text-primary-hover hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-12 text-sm text-foreground outline-none transition duration-200 placeholder:text-muted-foreground hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-border bg-surface accent-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                  />

                  <span className="text-sm text-muted">Keep me signed in</span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-[var(--background)] shadow-lg shadow-primary/15 transition duration-200 hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Signing you in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to CampusVault</span>

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Registration link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted">
                New to CampusVault?{" "}
                <Link
                  href="/Auth/register"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Security footer */}
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-border pt-6">
              <ShieldCheck size={15} className="text-success" />

              <p className="text-xs text-muted">
                Your academic space, securely accessible.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
