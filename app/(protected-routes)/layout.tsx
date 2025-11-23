import { ProtectedLayoutContent } from "@/components/auth/protected-layout-content";

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayoutContent>    <div className="w-full">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="p-4">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div></ProtectedLayoutContent>;
}
