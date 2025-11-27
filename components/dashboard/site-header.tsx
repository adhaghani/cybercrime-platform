"use client"

import { SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/dashboard/search-form"
import { DynamicBreadcrumb } from "@/components/dashboard/dynamic-breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

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
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        <ModeToggle/>
        </div>
      </div>
    </header>
  )
}
