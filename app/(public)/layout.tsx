import { Suspense, type ReactNode } from "react";

import Navbar from "../Components/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-16 w-full border-b border-default bg-background" />
        }
      >
        <Navbar />
      </Suspense>

      {children}
    </>
  );
}
