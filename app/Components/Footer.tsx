"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="text-primary" size={22} />
          <span className="font-bold">
            Campus<span className="text-primary">Vault</span>
          </span>
        </Link>
        <p className="text-center text-sm text-muted">
          A better way to share knowledge and learn together.
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CampusVault
        </p>
      </div>
    </footer>
  );
};

export default Footer;
