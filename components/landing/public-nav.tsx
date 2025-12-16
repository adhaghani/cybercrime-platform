import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function PublicNav() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          UiTM Cybercrime Platform
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/report">Latest Reports</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/emergency-services">Emergency Services</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/faq">FAQ</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
