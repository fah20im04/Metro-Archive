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
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import AuthWelcomePanel from "@/app/Components/Reusable/AuthWelcomePanel";

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
      "The form is valid, but account registration is not connected to a backend yet.",
    );
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  const selectClass =
    "w-full appearance-none rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <main className="min-h-[calc(100vh-73px)] bg-background px-4 py-10 text-foreground transition-colors duration-300 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-black/5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left Reusable Welcome Panel */}
        <div className="hidden lg:block">
          <AuthWelcomePanel
            title="Your academic journey starts here."
            description="Discover university notes, previous question papers, lab reports, and faculty resources in one organized place."
          >
            {/* Registration Feature List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <IdCard size={18} className="text-blue-200" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Verified Student Identity
                  </p>
                  <p className="text-[11px] text-blue-100/70">
                    Register securely with your official university ID
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck size={18} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Unified Learning Space
                  </p>
                  <p className="text-[11px] text-blue-100/70">
                    Connect directly with peer study materials safely
                  </p>
                </div>
              </div>
            </div>
          </AuthWelcomePanel>
        </div>

        {/* Right Form Panel */}
        <section className="bg-surface p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-xl">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2.5 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <GraduationCap size={23} />
              </div>

              <span className="text-xl font-bold tracking-tight text-foreground">
                Campus<span className="text-primary">Vault</span>
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                Student registration
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Enter your university details to join CampusVault.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* University ID */}
              <div>
                <label
                  htmlFor="universityId"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  University ID <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <IdCard
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="universityId"
                    name="universityId"
                    type="text"
                    value={formData.universityId}
                    onChange={handleChange}
                    placeholder="Enter your university ID"
                    autoComplete="off"
                    required
                    className={inputClass}
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-muted">
                  Use your official student ID. It will identify your account on
                  CampusVault.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Full name <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  University email <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
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

              {/* Department */}
              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Department <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted"
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
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="EEE">
                      Electrical & Electronic Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Administration">
                      Business Administration
                    </option>
                    <option value="English">English</option>
                    <option value="Law">Law</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Batch and Semester */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="batch"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Batch / Intake <span className="text-accent">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
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

                <div>
                  <label
                    htmlFor="semester"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Current semester <span className="text-accent">*</span>
                  </label>

                  <div className="relative">
                    <BookOpen
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted"
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Password <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-muted">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Confirm password <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(event) => setAgreeToTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-border bg-surface text-primary accent-primary"
                />

                <label
                  htmlFor="terms"
                  className="cursor-pointer text-sm leading-6 text-muted"
                >
                  I agree to use CampusVault responsibly and respect the
                  academic resources shared by the university community.
                </label>
              </div>

              {/* Feedback */}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                Create account
                <ArrowRight size={17} />
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-7 text-center">
              <p className="text-sm text-muted">
                Already have an account?{" "}
                <Link
                  href="/Auth/login"
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
          </div>
        </section>
      </div>
    </main>
  );
}
