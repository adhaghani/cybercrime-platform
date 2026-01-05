import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
export function PublicNav() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Button variant="ghost" size="lg" asChild>
              <Link href="/">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image 
                    src={"/logo.svg"}
                    alt="CyberSecure Logo"
                    width={32}
                    height={32}
                    className="dark:hidden block"
                  />
                  <Image
                    src={"/logo_dark.svg"}
                    alt="CyberSecure Logo"
                    width={32}
                    height={32}
                    className="hidden dark:block"
                  />
                </div>
                <div className="grid flex-1 items-center text-left text-sm leading-tight">
                  <span className="truncate font-medium">CyberSecure Platform</span>
                </div>
              </Link>
        </Button>

        <nav className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/emergency-services">Emergency Services</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/faq">FAQ</Link>
          </Button>
          {/* <Button asChild variant="ghost" size="sm">
            <Link href="/contact">Contact</Link>
          </Button> */}
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
