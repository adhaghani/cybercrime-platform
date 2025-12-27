"use client"

import {
  BadgeCheck,
  ChevronDown,
  Settings,
  LogOut,
  Monitor,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { useLogout } from "@/hooks/use-logout"
import Link from "next/link"

export function NavUser({
  user,
}: {
  user: {
    NAME: string
    EMAIL: string
    AVATAR_URL: string
  }
}) {
  const { logout } = useLogout()

  const getEmailInitials = (email: string) => {
    const parts = email.split("@")
    if (parts.length > 0 && parts[0].length > 0) {
      return parts[0].charAt(0).toUpperCase()
    }
    return ""
  }

  return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className=" mx-0"
            >              <ChevronDown className="ml-auto size-4" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-xs">{user.NAME}</span>
              </div>
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.AVATAR_URL} alt={user.NAME} />
                <AvatarFallback className="rounded-lg">{getEmailInitials(user.NAME)}</AvatarFallback>
              </Avatar>


            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <Link href="/dashboard/settings/account">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/settings/display">
                <DropdownMenuItem>
                  <Monitor />
                  Display
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/settings">
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}
