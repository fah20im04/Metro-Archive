"use client";

import {
  useState,
  useActionState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  GraduationCap,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  IdCard,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

import { registerAction } from "@/actions/auth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [clientError, setClientError] = useState("");

  const [state, formAction, isPending] = useActionState(registerAction, null);

  const [formData, setFormData] = useState({
    universityId: "",
    name: "",
    email: "",
    batch: "",
    password: "",
    confirmPassword: "",
    department: ""
  });

  // University ID validation
  const universityIdRegex = /^\d{3}-\d{3}-\d{3}$/;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setClientError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError("");

    if (formData.password.length < 8) {
      setClientError("Your password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setClientError("Passwords do not match. Please try again.");
      return;
    }

    if (!agreeToTerms) {
      setClientError("Please agree to the terms before creating your account.");
      return;
    }

    // Send only fields accepted by the backend.
    const submissionData = new FormData();

    submissionData.append("universityId", formData.universityId);
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("password", formData.password);

    if (formData.batch.trim()) {
      submissionData.append("batch", formData.batch.trim());
    }

    formAction(submissionData);
  };

  const inputClass =
    "w-full rounded-xl border border-default bg-surface py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/80 hover:border-strong focus:border-primary focus:ring-4 focus:ring-primary/10";

  const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-wider text-muted";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 transition-colors duration-200 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-[100px]" />

      {/* Main Register Card */}
      <div className="card relative w-full max-w-2xl overflow-hidden p-8 shadow-xl sm:p-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="group mb-4 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md transition-transform duration-300 group-hover:scale-105">
              <GraduationCap size={26} />
            </div>
          </Link>

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles size={13} />
            Student Registration Portal
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create Your Account<span className="text-accent">.</span>
          </h1>

          <p className="mt-2 text-xs text-muted sm:text-sm">
            Enter your university details to join the shared academic archive.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="border-b border-default pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                1. Personal Information
              </h2>
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
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="universityId"
                    name="universityId"
                    type="text"
                    value={formData.universityId}
                    onChange={handleChange}
                    placeholder="Official university ID (111-111-111)"
                    autoComplete="off"
                    required
                    pattern="\d{3}-\d{3}-\d{3}"
                    maxLength={11}
                    title="University ID must follow the format 111-111-111"
                    className={inputClass}
                  />
                </div>

                {/* University ID Validator */}
                {formData.universityId.length > 0 &&
                  !universityIdRegex.test(formData.universityId) && (
                    <p className="mt-1.5 text-xs text-red-500">
                      Valid University ID Format (111-111-111).
                    </p>
                  )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                    maxLength={254}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <div className="border-b border-default pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                2. Academic Information
              </h2>
            </div>

            {/* Department and Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="batch" className={labelClass}>
                  Department Name
                </label>
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department Initials (CSE, EEE)"
                  maxLength={3}
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <label htmlFor="batch" className={labelClass}>
                  Batch
                  <span className="ml-1 text-muted normal-case tracking-normal">
                    (Optional)
                  </span>
                </label>
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="batch"
                  name="batch"
                  type="text"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="Batch"
                  maxLength={3}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="space-y-4">
            <div className="border-b border-default pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                3. Account Security
              </h2>
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
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 chars"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm Password <span className="text-accent">*</span>
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-default bg-surface-secondary/50 p-4">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(event) => setAgreeToTerms(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-default bg-surface accent-primary"
            />

            <span className="text-xs leading-5 text-muted">
              I agree to use CampusVault responsibly and respect the academic
              resources shared by the university community.
            </span>
          </label>

          {/* Error / Success Messages */}
          {(clientError || state?.message) && (
            <div
              role="alert"
              className={`rounded-xl border px-4 py-3 text-sm ${state?.success
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-accent/30 bg-accent-light text-accent"
                }`}
            >
              {clientError || state?.message}

              {state?.errors && (
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

              {state?.success && (
                <div className="mt-2">
                  <Link href="/auth/login" className="font-semibold underline">
                    Continue to login
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || state?.success}
            className="btn-primary group w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Archive Account</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-xs text-muted">
          Already have an archive account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary transition hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <ShieldCheck size={14} className="shrink-0 text-primary" />
          <span>
            Your university credentials are encrypted and verified securely.
          </span>
        </div>
      </div >
    </main >
  );
}
