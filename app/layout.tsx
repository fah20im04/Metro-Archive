import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeProvider from "./Components/ThemeProvider";

export const metadata: Metadata = {
  title: "MUArchive | University Archive",
  description:
    "Explore university notes, previous question papers, lab reports, and faculty profiles in one place.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster position="top-right" richColors closeButton duration={3000} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
