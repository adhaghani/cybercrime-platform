import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export function PublicFooter() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="font-semibold tracking-tight">UiTM Cybercrime Platform</div>
            <p className="text-sm text-muted-foreground max-w-prose">
              A campus reporting and response platform for crime and facility incidents.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
            <Link href="/report" className="text-muted-foreground hover:text-foreground">
              Latest Reports
            </Link>
            <Link
              href="/emergency-services"
              className="text-muted-foreground hover:text-foreground"
            >
              Emergency Services
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            {/* <Link href="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link> */}
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} UiTM. All rights reserved.</span>
          <span>
            For emergencies, call <strong>999</strong>.
          </span>
        </div>
      </div>
    </footer>
  );
}
