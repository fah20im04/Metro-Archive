import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import "./globals.css";

import Navbar from "./Components/Navbar";
import ThemeProvider from "./Components/ThemeProvider";

export const metadata: Metadata = {
  title: "CampusVault | University Archive",
  description:
    "Explore university notes, previous question papers, lab reports, and faculty profiles in one place.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Suspense
            fallback={
              <div className="h-16 w-full border-b border-default bg-background" />
            }
          >
            <Navbar />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
