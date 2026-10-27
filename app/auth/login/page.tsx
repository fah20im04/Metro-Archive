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
} from "lucide-react";
import AuthWelcomePanel from "@/app/Components/Reusable/AuthWelcomePanel";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Auth Request
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 transition-colors duration-300 sm:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-lg lg:grid-cols-12">
        {/* Left Reusable Welcome Panel */}
        <div className="hidden lg:col-span-7 lg:block">
          <AuthWelcomePanel
            title="Welcome back to your academic hub."
            description="Access peer-reviewed lecture notes, past exam papers, research journals, and department schedules in seconds."
          >
            {/* Login Feature Preview Card */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <BookOpen size={18} className="text-blue-200" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Secure Student Access
                  </p>
                  <p className="text-[11px] text-blue-100/70">
                    Single Sign-On (SSO) Enabled
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-bold text-white">15k+</p>
                  <p className="text-[10px] text-blue-100/70">Students</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-bold text-white">40+</p>
                  <p className="text-[10px] text-blue-100/70">Depts</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-bold text-white">24/7</p>
                  <p className="text-[10px] text-blue-100/70">Access</p>
                </div>
              </div>
            </div>
          </AuthWelcomePanel>
        </div>

        {/* Right Form Panel */}
        <section className="flex items-center justify-center bg-surface p-6 sm:p-10 lg:col-span-5 xl:p-12">
          <div className="w-full max-w-sm">
            {/* Mobile Branding Logo */}
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                <GraduationCap size={22} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Campus<span className="text-primary">Vault</span>
              </span>
            </Link>

            {/* Header Text */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-muted">
                Please enter your details to sign in to your vault.
              </p>
            </div>

            {/* University SSO Button */}
            <button
              type="button"
              className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                />
              </svg>
              Sign in with University Edu ID
            </button>

            {/* Divider */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="absolute bg-surface px-3 text-xs uppercase tracking-wider text-muted-foreground">
                or email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-foreground"
                >
                  University Email
                </label>

                <div className="relative flex items-center">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 text-muted"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Password
                  </label>

                  <Link
                    href="/Auth/forgot-password"
                    className="text-xs font-semibold text-primary transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative flex items-center">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-3.5 text-muted"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 text-muted transition hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between py-1">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-surface text-primary focus:ring-primary/20"
                  />
                  <span className="text-xs font-medium text-muted">
                    Keep me signed in
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Footer Sign Up Link */}
            <p className="mt-8 text-center text-xs text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/Auth/register"
                className="font-semibold text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
