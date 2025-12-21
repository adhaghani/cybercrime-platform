"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  SquareTerminal,
  Users,
  FileText,
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
      url: "/dashboard/reports",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "All Reports",
          url: "/dashboard/reports",
        },
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
                {
          title: "Report Summary",
          url: "/dashboard/reports/report-summary",
        },
        {
          title: "Generate System Report",
          url: "/dashboard/reports/report-summary/generate",
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
  ];

  // Admin navigation - full access including user management
  const adminNav = [
        {
      title: "Report",
      url: "/dashboard/reports",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "All Reports",
          url: "/dashboard/reports",
        },
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
                {
          title: "Report Summary",
          url: "/dashboard/reports/report-summary",
        },
        {
          title: "Generate System Report",
          url: "/dashboard/reports/report-summary/generate",
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
          url: "/dashboard/users/staff",
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

  ];

  // Super Admin navigation - complete system access
  const superAdminNav = [
        {
      title: "Report",
      url: "/dashboard/reports",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "All Reports",
          url: "/dashboard/reports",
        },
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
                {
          title: "Report Summary",
          url: "/dashboard/reports/report-summary",
        },
        {
          title: "Generate System Report",
          url: "/dashboard/reports/report-summary/generate",
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
    }

  ];

  switch (role) {
    case 'SUPERADMIN':
      return superAdminNav;
    case 'ADMIN':
      return adminNav;
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
const getNavSecondaryByRole = (role: string | undefined) => {
  const commonSecondary = [
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
  ];

  // Admin-specific secondary nav
  if (role === 'ADMIN') {
    return [
      {
        title: "System Reports",
        url: "/dashboard/system-report",
        icon: FileText,
      },
      ...commonSecondary,
    ];
  }

  // Staff-specific secondary nav
  if (role === 'STAFF') {
    return [
      {
        title: "My Assignments",
        url: "#",
        icon: Frame,
      },
      ...commonSecondary,
    ];
  }

  // Student/User secondary nav
  return [
    {
      title: "My Reports",
      url: "#",
      icon: Frame,
    },
    ...commonSecondary,
  ];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { claims } = useAuth()
  const user = {
    name: (claims?.user_metadata?.name as string) || "User",
    email: claims?.email || "",
    avatar: (claims?.user_metadata?.avatarUrl as string) || "/default-avatar.png",
  }

  const navMain = getNavMainByRole(claims?.role);
  const navSecondary = getNavSecondaryByRole(claims?.role);

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
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
