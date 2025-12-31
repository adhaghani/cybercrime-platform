"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Student, Staff } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Mail, MoreHorizontal, UserCheck, 
 UserX, ArrowUpDown, GraduationCap, User
} from "lucide-react";
import { getInitials } from "@/lib/utils/badge-helpers";

interface ColumnsConfig {
  onViewDetails: (accountId: string) => void;
  onDelete: (accountId: string, name: string, email: string) => void;
  isAdmin: boolean;
  currentAccountId: string | null;
}

export const createColumns = ({
  onViewDetails,
  onDelete,
  isAdmin,
  currentAccountId,
}: ColumnsConfig): ColumnDef<Student | Staff>[] => [
  {
    accessorKey: "NAME",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Account Holder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.AVATAR_URL} />
            <AvatarFallback className="bg-blue-500/10 text-blue-500">
              {getInitials(user.NAME)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.NAME}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.EMAIL}
            </div>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "ID",
    header: () => <span>ID</span>,
    cell: ({ row }) => {
        const user = row.original;
        const isStudent = (user as Student).ACCOUNT_TYPE === "STUDENT";
        const idValue = isStudent ? (user as Student).STUDENT_ID : (user as Staff).STAFF_ID;
      return (
        <span className="font-mono text-sm">{idValue}</span>
      );
    },
  },
  {
    accessorKey: "ACCOUNT_TYPE",
    header: () => <span>Account Type</span>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant="outline">
          {user.ACCOUNT_TYPE === "STUDENT" ? <GraduationCap className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" /> }{" "}{user.ACCOUNT_TYPE}
        </Badge>
      );
    }   
  },
  {
    accessorKey: "CONTACT_NUMBER",
    header: () => <span>Phone</span>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className="font-mono text-sm truncate max-w-[150px] block">
              {user.CONTACT_NUMBER || "N/A"}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.CONTACT_NUMBER || "N/A"}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const isCurrentUser = student.ACCOUNT_ID === currentAccountId;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewDetails(student.ACCOUNT_ID)}>
                <UserCheck className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {isAdmin && !isCurrentUser && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(student.ACCOUNT_ID, student.NAME, student.EMAIL)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Delete Account
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
