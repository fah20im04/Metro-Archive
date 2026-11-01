"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  GraduationCap,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  IdCard,
  Building2,
  CalendarDays,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  BedSingle,
} from "lucide-react";
import AuthWelcomePanel from "@/app/Components/Reusable/AuthWelcomePanel";
import RegisterWelcomePanel from "@/app/Components/Reusable/RegisterWelcomePanel";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    universityId: "",
    fullName: "",
    email: "",
    department: "",
    batch: "",
    semester: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms before creating your account.");
      return;
    }

    setError(
      "Your details are valid, but registration is not connected to a backend yet.",
    );
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/80 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

  const selectClass =
    "w-full appearance-none rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm text-foreground outline-none transition hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

  const labelClass = "mb-2 block text-sm font-semibold text-foreground";

  return (
    <main className="min-h-[calc(100vh-73px)] bg-background px-4 py-8 text-foreground transition-colors duration-300 sm:px-6 sm:py-12">
      {/* Subtle background decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary-light/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-230 -right-40 h-96 w-96 rounded-full bg-accent-light/40 blur-3xl" />
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-black/[0.04] lg:grid-cols-[0.85fr_1.15fr]">
        {/* Welcome panel */}
        <div className="hidden lg:block p-10 ">
          <RegisterWelcomePanel
            title="Your academic journey starts here."
            description="Discover university notes, previous question papers, lab reports, and faculty resources in one organized place."
            badgeText="Join CampusVault"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <IdCard size={19} className="text-blue-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Student identity
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-100/70">
                    Use your official university ID.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck size={19} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    One learning space
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-100/70">
                    Organize your academic resources.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <BookOpen size={19} className="text-amber-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Exam-Ready Resources
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-100/70">
                    Access previous question papers and study materials with
                    ease.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <BedSingle size={19} className="text-amber-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Get-Ready to be the best
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-100/70">
                    Turn on your laptop and be the best
                  </p>
                </div>
              </div>
            </div>
          </RegisterWelcomePanel>
        </div>

        {/* Registration form */}
        <section className="min-w-0 bg-surface p-5 sm:p-9 lg:p-10 xl:p-12">
          <div className="mx-auto max-w-xl">
            {/* Mobile branding */}
            <Link
              href="/"
              className="mb-7 inline-flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <GraduationCap size={23} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Campus<span className="text-primary">Vault</span>
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary-light text-primary">
                <UserRound size={23} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Student registration
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                Enter your university details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic information */}
              <div>
                <h2 className="text-sm font-semibold">Personal information</h2>
                <p className="mt-1 text-xs text-muted">Tell us who you are.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* University ID */}
                <div className="sm:col-span-2">
                  <label htmlFor="universityId" className={labelClass}>
                    University ID <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <IdCard
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      id="universityId"
                      name="universityId"
                      type="text"
                      value={formData.universityId}
                      onChange={handleChange}
                      placeholder="Enter your official university ID"
                      autoComplete="off"
                      required
                      className={inputClass}
                    />
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-muted">
                    This ID will identify your CampusVault account.
                  </p>
                </div>

                {/* Full name */}
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full name <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    University email <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Academic information */}
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-semibold">Academic information</h2>
                <p className="mt-1 text-xs text-muted">
                  Help us organize your university resources.
                </p>
              </div>

              <div className="space-y-4">
                {/* Department */}
                <div>
                  <label htmlFor="department" className={labelClass}>
                    Department <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
                    />
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className={selectClass}
                    >
                      <option value="" disabled>
                        Select your department
                      </option>
                      <option value="CSE">
                        Computer Science & Engineering
                      </option>
                      <option value="EEE">
                        Electrical & Electronic Engineering
                      </option>
                      <option value="Civil Engineering">
                        Civil Engineering
                      </option>
                      <option value="Business Administration">
                        Business Administration
                      </option>
                      <option value="English">English</option>
                      <option value="Law">Law</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Batch */}
                  <div>
                    <label htmlFor="batch" className={labelClass}>
                      Batch / Intake <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <CalendarDays
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="batch"
                        name="batch"
                        type="text"
                        value={formData.batch}
                        onChange={handleChange}
                        placeholder="e.g. 60th"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Semester */}
                  <div>
                    <label htmlFor="semester" className={labelClass}>
                      Current semester <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
                      />
                      <select
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        required
                        className={selectClass}
                      >
                        <option value="" disabled>
                          Select semester
                        </option>
                        {Array.from({ length: 12 }, (_, index) => (
                          <option key={index + 1} value={String(index + 1)}>
                            Semester {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-semibold">Account security</h2>
                <p className="mt-1 text-xs text-muted">
                  Choose a strong password for your account.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Password */}
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm password <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/60 p-3.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(event) => setAgreeToTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                />
                <span className="text-xs leading-5 text-muted">
                  I agree to use CampusVault responsibly and respect the
                  academic resources shared by the university community.
                </span>
              </label>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-accent/30 bg-accent-light px-4 py-3 text-sm text-accent"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                Create account
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-7 text-center">
              <p className="text-sm text-muted">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary transition hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <p className="mt-7 text-center text-xs leading-5 text-muted">
              Your university ID should be unique to your account. Registration
              and student verification must be handled securely by the server.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted">
              <ShieldCheck size={15} className="shrink-0" />
              <span>
                Your information should be verified securely by the server.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
