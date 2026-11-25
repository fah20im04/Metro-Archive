"use client";
import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX size={38} />
        </div>

        <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-primary">
          ERROR 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved, deleted, or the link might be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 !text-white text-sm font-semibold transition hover:bg-primary-hover"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-surface-secondary"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        <p className="mt-12 text-xs text-muted">
          MUArchive · University Archive
        </p>
      </div>
    </main>
  );
}
