/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
// simport { Staff } from "@/lib/types";
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
  Mail, Phone, MoreHorizontal, UserCheck, 
  Briefcase, Shield, UserX, ArrowUpDown, 
  FileText
} from "lucide-react";
import { getInitials, getDepartmentColor } from "@/lib/utils/badge-helpers";

interface ColumnsConfig {
  onViewDetails: (accountId: string) => void;
  onViewAssignments?: (accountId: string, name: string) => void;
  onViewReports?: (accountId: string, name: string) => void;
  onPromote?: (accountId: string, name: string) => void;
  onDelete?: (accountId: string, name: string, email: string) => void;
  isAdmin: boolean;
  currentAccountId: string | null;
}

export const createColumns = ({
  onViewDetails,
  onViewAssignments,
  onViewReports,
  onPromote,
  onDelete,
  isAdmin,
  currentAccountId,
}: ColumnsConfig): ColumnDef<any>[] => [
  {
    accessorKey: "NAME",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Staff Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.AVATAR_URL} />
            <AvatarFallback className="bg-green-500/10 text-green-500">
              {getInitials(member.NAME)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex gap-1 items-center">
              <p>{member.NAME}</p>
              <Badge variant="outline" className={getDepartmentColor(member.DEPARTMENT)}>
                {member.ROLE}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {member.EMAIL}
            </div>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "STAFF_ID",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Staff ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("STAFF_ID")}</span>
    ),
  },
  {
    accessorKey: "DEPARTMENT",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const department = row.getValue("DEPARTMENT") as string;
      return (
        <Badge className={getDepartmentColor(department)}>
          {department}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "POSITION",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue("POSITION")}</div>
    ),
  },
  {
    accessorKey: "CONTACT_NUMBER",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Phone className="h-3 w-3" />
        {row.getValue("CONTACT_NUMBER")}
      </div>
    ),
  },
  {
    accessorKey: "ROLE",
    header: "Role",
    cell: ({ row }) => row.getValue("ROLE"),
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original;
      const isCurrentUser = member.ACCOUNT_ID === currentAccountId;

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
              <DropdownMenuItem onClick={() => onViewDetails(member.ACCOUNT_ID)}>
                <UserCheck className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
                {onViewReports && (
                    <DropdownMenuItem onClick={() => onViewReports(member.ACCOUNT_ID, member.NAME)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Reports
                    </DropdownMenuItem>
                )}
              {onViewAssignments && (<DropdownMenuItem onClick={() => onViewAssignments(member.ACCOUNT_ID, member.NAME)}>
                <Briefcase className="mr-2 h-4 w-4" />
                View Assignments
              </DropdownMenuItem>)}
              {isAdmin && !isCurrentUser && (
                <>
                  <DropdownMenuSeparator />
                    {onPromote && <DropdownMenuItem onClick={() => onPromote(member.ACCOUNT_ID, member.NAME)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Promote to Admin
                    </DropdownMenuItem>}
                    {onDelete && <DropdownMenuItem
                        onClick={() => onDelete(member.ACCOUNT_ID, member.NAME, member.EMAIL)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <UserX className="mr-2 h-4 w-4" />
                        Delete Account
                    </DropdownMenuItem>}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
