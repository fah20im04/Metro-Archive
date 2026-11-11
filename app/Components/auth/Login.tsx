"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  IdCard,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

import { loginAction } from "@/actions/auth";

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");

  const [state, formAction, isPending] = useActionState(loginAction, null);

  // University ID validation
  const universityIdRegex = /^\d{3}-\d{3}-\d{3}$/;

  useEffect(() => {
    if (state?.success) {
      router.replace("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 transition-colors duration-200 sm:px-6 lg:px-8">
      {/* Decorative background ambient lighting */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-[100px]" />

      {/* Main Single-Panel Login Card */}
      <div className="card relative w-full max-w-md overflow-hidden p-8 shadow-xl sm:p-10">
        {/* Top Header & Branding */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="group mb-4 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md transition-transform duration-300 group-hover:scale-105">
              <GraduationCap size={26} />
            </div>
          </Link>

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles size={13} />
            University Archive Portal
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome Back<span className="text-accent">.</span>
          </h1>

          <p className="mt-2 text-xs text-muted sm:text-sm">
            Sign in to access shared lecture notes, archives, and research
            papers.
          </p>
        </div>

        {/* Login Form */}
        <form action={formAction} className="mt-8 space-y-5">
          {/* University ID Field */}
          <div>
            <label
              htmlFor="universityId"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              University ID
            </label>

            <div className="group relative">
              <IdCard
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
              />

              <input
                id="universityId"
                name="universityId"
                type="text"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                placeholder="111-111-111"
                autoComplete="username"
                required
                pattern="\d{3}-\d{3}-\d{3}"
                maxLength={11}
                title="University ID must follow the format XXX-XXX-XXX"
                className="w-full rounded-xl border border-default bg-surface py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition duration-200 hover:border-strong focus:border-primary"
              />
            </div>

            {universityId.length > 0 &&
              !universityIdRegex.test(universityId) && (
                <p className="mt-1.5 text-xs text-red-500">
                  Valid University ID Format (111-111-111).
                </p>
              )}
          </div>

          {/* Password Field */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Password
              </label>

              <Link
                href="/Auth/forgot-password"
                className="text-xs font-medium text-primary transition hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="group relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
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
                maxLength={72}
                className="w-full rounded-xl border border-default bg-surface py-3.5 pl-11 pr-12 text-sm text-foreground outline-none transition duration-200 hover:border-strong focus:border-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-default bg-surface accent-primary"
              />
              <span className="text-xs text-muted">Keep me signed in</span>
            </label>
          </div>

          {/* Backend Error Message */}
          {state && !state.success && (
            <div
              role="alert"
              className="rounded-xl border border-accent/30 bg-accent-light px-4 py-3 text-sm text-accent"
            >
              {state.message}

              {state.errors && (
                <ul className="mt-2 list-inside list-disc">
                  {Object.entries(state.errors).map(([field, messages]) =>
                    messages?.map((message, index) => (
                      <li key={`${field}-${index}`}>
                        {field}: {message}
                      </li>
                    )),
                  )}
                </ul>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex mx-auto items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white! transition hover:bg-blue-700"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Access Archive</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Sign Up */}
        <p className="mt-8 text-center text-xs text-muted">
          Don&apos;t have an archive account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-accent transition hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
