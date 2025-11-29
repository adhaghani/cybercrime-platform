"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  SquareTerminal,
} from "lucide-react"
import { useAuth } from "@/lib/context/auth-provider"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Crime Terminal",
      url: "/dashboard/crime",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Submit a Report",
          url: "/dashboard/crime/submit-report",
        },
        {
          title: "Crime Statistic",
          url: "/dashboard/crime/statistics",
        },
        {
          title: "View All Crime Report",
          url: "/dashboard/crime/reports",
        },
        {
          title: "My Crime Reports",
          url: "/dashboard/crime/my-reports",
        },
      ],
    },
        {
      title: "Facilities Terminal",
      url: "/dashboard/facility",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Submit a Report",
          url: "/dashboard/facility/submit-report",
        },
        {
          title: "View All Facility Reports",
          url: "/dashboard/facility/reports",
        },
        {
          title: "My Facility Reports",
          url: "/dashboard/facility/my-reports",
        },
      ],
    },
    {
      title: "Emergency Services",
      url: "/dashboard/emergency-services",
      icon: Bot,
      items: [
        {
          title: "UiTM Auxiliary Police",
          url: "/dashboard/emergency-services/uitm-auxiliary-police",
        },
        {
          title: "All Emergency Contacts",
          url: "/dashboard/emergency-services/emergency-contacts",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "My Reports",
      url: "#",
      icon: Frame,
    },
    {
      title: "Get Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "App Tutorial",
      url: "#",
      icon: BookOpen,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { claims } = useAuth()
  const user = {
    name: claims?.user_metadata?.full_name || "User",
    email: claims?.email || "",
    avatar: claims?.user_metadata?.avatar_url || "/default-avatar.png",
  }

  return (
    <Sidebar
      className="top-12 h-[calc(100vh-3rem)] shrink-0" 
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 items-center text-left text-sm leading-tight">
                  <span className="truncate font-medium">CyberSafe Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
