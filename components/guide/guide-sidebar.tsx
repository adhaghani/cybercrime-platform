"use client"

import * as React from "react"
import {
  BookOpen,
  Home,
  Shield,
  AlertCircle,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const guideNavigation = [
  {
    title: "Getting Started",
    icon: Home,
    items: [
      { title: "Introduction", href: "#introduction" },
      { title: "Account Setup", href: "#account-setup" },
      { title: "First Login", href: "#first-login" },
      { title: "Dashboard Overview", href: "#dashboard-overview" },
    ],
  },
  {
    title: "Reporting Incidents",
    icon: AlertCircle,
    items: [
      { title: "Crime Reports", href: "#crime-reports" },
      { title: "Facility Reports", href: "#facility-reports" },
      { title: "Submitting a Report", href: "#submitting-report" },
      { title: "Tracking Your Reports", href: "#tracking-reports" },
      { title: "Report Status", href: "#report-status" },
    ],
  },
  {
    title: "Emergency Services",
    icon: Shield,
    items: [
      { title: "UiTM Auxiliary Police", href: "#uitm-police" },
      { title: "Emergency Contacts", href: "#emergency-contacts" },
      { title: "When to Report", href: "#when-to-report" },
    ],
  },
  {
    title: "Staff Features",
    icon: Users,
    items: [
      { title: "Managing Reports", href: "#managing-reports" },
      { title: "Assigning Cases", href: "#assigning-cases" },
      { title: "Creating Announcements", href: "#announcements" },
      { title: "Team Management", href: "#team-management" },
    ],
  },
  {
    title: "Admin Features",
    icon: Settings,
    items: [
      { title: "User Management", href: "#user-management" },
      { title: "System Reports", href: "#system-reports" },
      { title: "AI Report Generation", href: "#ai-reports" },
      { title: "Access Control", href: "#access-control" },
    ],
  },
  {
    title: "FAQ & Support",
    icon: HelpCircle,
    items: [
      { title: "Common Questions", href: "#faq" },
      { title: "Troubleshooting", href: "#troubleshooting" },
      { title: "Contact Support", href: "#support" },
    ],
  },
];

export function GuideSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <aside
      className="h-full w-64 shrink-0 border-r bg-sidebar" 
      {...props}
    >
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5" />
          <div>
            <h2 className="text-sm font-semibold">User Guide</h2>
            <p className="text-xs text-muted-foreground">Table of Contents</p>
          </div>
        </div>
      </div>
      <div className="px-2 py-4 h-fit">
        {guideNavigation.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="flex items-center gap-2 px-2 py-2 text-sm font-medium">
              <section.icon className="size-4" />
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link 
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <ChevronRight className="size-3 opacity-50" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
