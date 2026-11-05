"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useTheme } from "next-themes";

import { logoutAction } from "@/actions/auth";

export type CurrentUser = {
  id: string;
  name: string;
  universityId: string;
  email: string;
  role: string;
  departmentId: string | null;
  batch: string | null;
  accountStatus: string;
  createdAt: string;
};

type NavbarClientProps = {
  currentUser: CurrentUser | null;
};

export default function NavbarClient({ currentUser }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const isLoggedIn = Boolean(currentUser);

  const navLinks = [
    { label: "Home", href: "/" },
    ...(isLoggedIn
      ? [
          { label: "Archives", href: "/archives" },
          { label: "Question Bank", href: "/questionBank" },
        ]
      : []),
    { label: "Faculty", href: "/faculty" },
  ];

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await logoutAction();

      if (!result.success) {
        console.error(result.message);
        return;
      }

      setProfileOpen(false);
      setMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-foreground backdrop-blur-lg transition-colors">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <GraduationCap size={24} />
          </div>

          <span className="text-xl font-bold tracking-tight text-foreground">
            Campus<span className="text-primary">Vault</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                link.href === "/"
                  ? "font-semibold text-primary"
                  : "font-medium text-muted hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-secondary"
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {currentUser ? (
            /* Profile Dropdown */
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-secondary"
              >
                <UserCircle size={22} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-border bg-background p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <UserCircle size={32} className="shrink-0 text-primary" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {currentUser.name}
                      </p>

                      <p className="truncate text-xs text-muted">
                        {currentUser.universityId}
                      </p>
                    </div>
                  </div>

                  <div className="my-3 border-t border-border" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut size={17} />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Authentication Links */
            <>
              <Link
                href="/auth/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-secondary"
              >
                Sign in
              </Link>

              <Link
                href="/auth/register"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-blue-700"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-secondary"
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-foreground transition hover:bg-surface-secondary"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  link.href === "/"
                    ? "bg-primary-light text-primary"
                    : "text-foreground hover:bg-surface-secondary hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {currentUser ? (
                <>
                  {/* Mobile User Information */}
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                    <UserCircle size={28} className="shrink-0 text-primary" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {currentUser.name}
                      </p>

                      <p className="text-xs text-muted">
                        {currentUser.universityId}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut size={17} />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMenus}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-secondary"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={closeMenus}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-blue-700"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
