"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Crime Terminal",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Submit a Report",
          url: "#",
        },
        {
          title: "Crime Statistic",
          url: "#",
        },
        {
          title: "View All Crime Report",
          url: "#",
        },
        {
          title: "My Crime Reports",
          url: "#",
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
