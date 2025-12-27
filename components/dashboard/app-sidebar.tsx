"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  SquareTerminal,
  Users,
  FileText,
  Stars,
} from "lucide-react"
import { useAuth } from "@/lib/context/auth-provider"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

/**
 * Get navigation items based on user role
 */
const getNavMainByRole = (role: string | undefined) => {
  // Student/User navigation
  const studentNav = [
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
          title: "My Crime Reports",
          url: "/dashboard/crime/my-reports",
        },
        {
          title: "All Crime Reports",
          url: "/dashboard/crime/reports",
        }
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
          title: "My Facility Reports",
          url: "/dashboard/facility/my-reports",
        },
        {
          title: "All Facility Reports",
          url: "/dashboard/facility/reports",
        }
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
  ];

  // Staff navigation - can view all reports and manage them
  const staffNav = [
        {
      title: "Report",
      url: "#",
      icon: FileText,
      isActive: true,
      items: [

        {
          title: "Crime Reports",
          url: "/dashboard/reports/crime",
        },
        {
          title: "Facility Reports",
          url: "/dashboard/reports/facility",
        },
        {
          title: "My Assigned Reports",
          url: "/dashboard/reports/my-assignments",
        },
      ],
    },
    {
      title: "AI Report Summary",
      url: "/dashboard/reports/report-summary",
      icon: Stars,
      items: [
        {
          title: "View Past Reports",
          url: "/dashboard/reports/report-summary",
        },
        {
          title: "Generate AI Report",
          url: "/dashboard/reports/report-summary/generate",
        }
      ]
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
                {
          title: "Add New Contact",
          url: "/dashboard/emergency-services/add",
        }
      ],
    },
    {
      title: "Announcements",
      url: "/dashboard/announcement",
      icon: FileText,
      items: [
        {
          title: "All Announcements",
          url: "/dashboard/announcement",
        },
        {
          title: "Create Announcement",
          url: "/dashboard/announcement/new-announcement",
        },
      ],
    },
    {
      title: "Team",
      url: "/dashboard/team/my-team",
      icon: Users,
    }
  ];

  // supervisor navigation - can view/manage their team
  const supervisorNav = [
        {
      title: "Report",
      url: "#",
      icon: FileText,
      isActive: true,
      items: [

        {
          title: "Crime Reports",
          url: "/dashboard/reports/crime",
        },
        {
          title: "Facility Reports",
          url: "/dashboard/reports/facility",
        },
        {
          title: "My Assigned Reports",
          url: "/dashboard/reports/my-assignments",
        },
      ],
    },
    {
      title: "AI Report Summary",
      url: "/dashboard/reports/report-summary",
      icon: Stars,
      items: [
        {
          title: "View Past Reports",
          url: "/dashboard/reports/report-summary",
        },
        {
          title: "Generate AI Report",
          url: "/dashboard/reports/report-summary/generate",
        }
      ]
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
                {
          title: "Add New Contact",
          url: "/dashboard/emergency-services/add",
        }
      ],
    },
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: Users,
      items: [
        {
          title: "Staff Members",
          url: "/dashboard/user-management/staff",
        },
      ],
    },
    {
      title: "Announcements",
      url: "/dashboard/announcement",
      icon: FileText,
      items: [
        {
          title: "All Announcements",
          url: "/dashboard/announcement",
        },
        {
          title: "Create Announcement",
          url: "/dashboard/announcement/new-announcement",
        },
      ],
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: Users,
      items: [
        {
          title: "My Team",
          url: "/dashboard/team/my-team",
        }
      ]
    },


  ];

  // Admin navigation - full access including user management
  const adminNav = [
        {
      title: "Report",
      url: "#",
      icon: FileText,
      isActive: true,
      items: [

        {
          title: "Crime Reports",
          url: "/dashboard/reports/crime",
        },
        {
          title: "Facility Reports",
          url: "/dashboard/reports/facility",
        },
        {
          title: "My Assigned Reports",
          url: "/dashboard/reports/my-assignments",
        },
      ],
    },
    {
      title: "AI Report Summary",
      url: "/dashboard/reports/report-summary",
      icon: Stars,
      items: [
        {
          title: "View Past Reports",
          url: "/dashboard/reports/report-summary",
        },
        {
          title: "Generate AI Report",
          url: "/dashboard/reports/report-summary/generate",
        }
      ]
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
                {
          title: "Add New Contact",
          url: "/dashboard/emergency-services/add",
        }
      ],
    },
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/user-management/all-user",
        },
        {
          title: "Staff Members",
          url: "/dashboard/user-management/staff",
        },
      ],
    },
    {
      title: "Announcements",
      url: "/dashboard/announcement",
      icon: FileText,
      items: [
        {
          title: "All Announcements",
          url: "/dashboard/announcement",
        },
        {
          title: "Create Announcement",
          url: "/dashboard/announcement/new-announcement",
        },
      ],
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: Users,
    },


  ];

  // Super Admin navigation - complete system access
  const superAdminNav = [
        {
      title: "Report",
      url: "#",
      icon: FileText,
      isActive: true,
      items: [

        {
          title: "Crime Reports",
          url: "/dashboard/reports/crime",
        },
        {
          title: "Facility Reports",
          url: "/dashboard/reports/facility",
        },
        {
          title: "My Assigned Reports",
          url: "/dashboard/reports/my-assignments",
        },
      ],
    },
    {
      title: "AI Report Summary",
      url: "/dashboard/reports/report-summary",
      icon: Stars,
      items: [
        {
          title: "View Past Reports",
          url: "/dashboard/reports/report-summary",
        },
        {
          title: "Generate AI Report",
          url: "/dashboard/reports/report-summary/generate",
        }
      ]
    },
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/user-management/all-user",
        },
        {
          title: "Students",
          url: "/dashboard/user-management/students",
        },
        {
          title: "Staff Members",
          url: "/dashboard/user-management/staff",
        },
        {
          title: "Administrators",
          url: "/dashboard/user-management/administrator",
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
        {
          title: "Add New Contact",
          url: "/dashboard/emergency-services/add",
        }
      ],
    },
        {
      title: "Announcements",
      url: "/dashboard/announcement",
      icon: FileText,
      items: [
        {
          title: "All Announcements",
          url: "/dashboard/announcement",
        },
        {
          title: "Create Announcement",
          url: "/dashboard/announcement/new-announcement",
        },
      ],
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: Users,
    },


  ];

  switch (role) {
    case 'SUPERADMIN':
      return superAdminNav;
    case 'ADMIN':
      return adminNav;
    case 'SUPERVISOR':
      return supervisorNav;
    case 'STAFF':
      return staffNav;
    case 'STUDENT':
    default:
      return studentNav;
  }
}

/**
 * Get secondary navigation items based on user role
 */
const getNavSecondaryByRole = () => {
  const commonSecondary = [
    {
      title: "App Guide",
      url: "/guide",
      icon: BookOpen,
    },
  ];

  // Student/User secondary nav
  return commonSecondary;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { claims } = useAuth()
  const navMain = getNavMainByRole(claims?.ROLE);
  const navSecondary = getNavSecondaryByRole();

  return (
    <Sidebar
    collapsible="offcanvas"
      className="top-12 h-[calc(100vh-3rem)] shrink-0" 
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 items-center text-left text-sm leading-tight">
                  <span className="truncate font-medium">CyberSafe Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} className="mb-4" />
      </SidebarFooter>
    </Sidebar>
  )
}
