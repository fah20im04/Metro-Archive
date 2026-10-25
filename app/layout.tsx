import type { Metadata } from "next";
import type { ReactNode } from "react";
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
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
