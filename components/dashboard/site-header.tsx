"use client"

import { SearchIcon, SidebarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { DynamicBreadcrumb } from "@/components/dashboard/dynamic-breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {  useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useHasAnyRole } from "@/hooks/use-user-role"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { NavUser } from "./nav-user"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Link from "next/link"
import { useAuth } from "@/lib/context/auth-provider"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const [open, setOpen] = useState(false)
  useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])
  
  const hasAnyRole = useHasAnyRole();
  const isAdmin = hasAnyRole(['ADMIN', 'SUPERADMIN']);
  const isSupervisor = hasAnyRole(['SUPERVISOR']);
    const { claims } = useAuth()
    const user = {
      NAME: (claims?.NAME as string) || "User",
      EMAIL: claims?.EMAIL || "",
      AVATAR_URL: (claims?.AVATAR_URL as string) || "/default-avatar.png",
    };
  const isStudent = claims?.ACCOUNT_TYPE === 'STUDENT';

  const determineCommandsItems = () => {
        const staffItems = [
      {
        key: "dashboard",
        heading: "Dashboard",
        items: [
          { key: "dashboard", label: "Dashboard", href: "/dashboard" }
        ]
      },
      {
        key: "report",
        heading: "Reports",
        items: [
          { key: "crime-reports", label: "Crime Reports", href: "/dashboard/reports/crime" },
          { key: "facility-reports", label: "Facility Reports", href: "/dashboard/reports/facility" },
          { key: "my-assigned", label: "My Assigned Report", href: "/dashboard/reports/my-assignments" },
        ]
      },
      {
        key: "announcements",
        heading: "Announcements",
        items: [
          { key: "all-announcements", label: "All Announcements", href: "/dashboard/announcement" },
          { key: "new-announcement", label: "Create Announcement", href: "/dashboard/announcement/new-announcement" },
        ]
      },
      {
        key: "emergency-services",
        heading: "Emergency Services",
        items: [
          { key: "uitm-auxiliary-police", label: "UITM Auxiliary Police", href: "/dashboard/emergency-services/uitm-auxiliary-police" },
          { key: "emergency-contacts", label: "Emergency Services", href: "/dashboard/emergency-services/emergency-contacts" },
          { key: "add-emergency-contact", label: "Add Emergency Contact", href: "/dashboard/emergency-services/add" },
        ]
      },
      {
        key: "teams",
        heading: "Teams",
        items: [
          { key: "team", label: "Teams", href: "/team" }
        ]
      },
    ];

    if(isStudent) {
      return [
        {
          key: "dashboard",
          heading: "Dashboard",
          items: [
            { key: "dashboard", label: "Dashboard", href: "/dashboard" }
          ]
        },
        {
          key: "emergency",
          heading: "Emergency Services",
          items: [
            { key: "emergency", label: "Emergency Services", href: "/dashboard/emergency-services" }
          ]
        },
        {
          key: "crime",
          heading: "Crime",
          items: [
            { key: "all-crime-reports", label: "All Crime Report", href: "/dashboard/crime/reports" },
            { key: "submit-crime", label: "Report a Crime", href: "/dashboard/crime/submit-report" },
            { key: "my-crime-reports", label: "My Crime Reports", href: "/dashboard/crime/my-reports" },
          ]
        },
        {
          key: "facility",
          heading: "Facility",
          items: [
            { key: "all-facility-reports", label: "All Facility Reports", href: "/dashboard/facility/reports" },
            { key: "submit-facility", label: "Submit Facility Report", href: "/dashboard/facility/submit-report" },
            { key: "my-facility-reports", label: "My Facility Reports", href: "/dashboard/facility/my-reports" },
          ]
        }
      ];
    }
        else if (isAdmin) {
      return [
        ...staffItems,
        {
          key: "ai-report",
          heading: "AI Report",
          items: [
            { key: "past-report", label: "View All AI Generated Reports", href: "/dashboard/reports/report-summary" },
            { key: "generate-report", label: "Generate Reports", href: "/dashboard/reports/report-summary/generate" },
          ]
        },
        {
          key: "user-management",
          heading: "User Management",
          items: [
            { key: "all-users", label: "All User", href: "/dashboard/user-management/all-user" },
            { key: "students", label: "Students", href: "/dashboard/user-management/students" },
            { key: "staff", label: "View Staff", href: "/dashboard/user-management/staff" },
            { key: "administrator", label: "Administrator", href: "/dashboard/user-management/administrator" },
          ]
        },
      ];
    }
    
    else if (isSupervisor) {
      return [
        ...staffItems,
        {
          key: "ai-report",
          heading: "AI Report",
          items: [
            { key: "past-report", label: "View All AI Generated Reports", href: "/dashboard/reports/report-summary" },
            { key: "generate-report", label: "Generate Reports", href: "/dashboard/reports/report-summary/generate" },
          ]
        },
        {
          key: "user-management",
          heading: "User Management",
          items: [
            { key: "staff-view", label: "View Staff", href: "/dashboard/user-management/staff" }
          ]
        },
      ];
    }
    else {
      return staffItems;
    }

  }

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-12 w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DynamicBreadcrumb />
        <div className="flex items-center gap-2 w-fit ml-auto">
        <NavUser user={user} />
        <div className="relative">
        <InputGroup onClick={() => setOpen(true)}>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
        </div>
        <ModeToggle/>
        </div>

      </div>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search for a page" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {(() => {
                const items = determineCommandsItems();
                return items?.map((group, index) => (
                  <div key={group.key}>
                    <CommandGroup heading={group.heading}>
                      {group.items.map((item) => (
                        <CommandItem key={item.key} asChild>
                          <Link href={item.href} onClick={() => setOpen(false)}>
                            {item.label}
                          </Link>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {index < items.length - 1 && <CommandSeparator />}
                  </div>
                ));
              })()}
            </CommandList>
          </CommandDialog>
    </header>
  )
}
