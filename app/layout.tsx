import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Instrument_Sans,
  Bricolage_Grotesque,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
import ThemeProvider from "./Components/ThemeProvider";

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MUArchive | University Archive",
  description:
    "Explore university notes, previous question papers, lab reports, and faculty profiles in one place.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${heading.variable} ${mono.variable}`}
    >
      <body>
        <Toaster position="top-right" richColors closeButton duration={3000} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
