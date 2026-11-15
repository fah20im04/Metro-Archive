import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
