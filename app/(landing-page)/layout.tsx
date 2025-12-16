import type { ReactNode } from "react";

import { PublicFooter } from "@/components/landing/public-footer";
import { PublicNav } from "@/components/landing/public-nav";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <PublicNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</div>
      <PublicFooter />
    </div>
  );
}
