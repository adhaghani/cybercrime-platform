"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/lib/types";
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
  Mail, Phone, MoreHorizontal, UserCheck, 
  FileText, UserX, ArrowUpDown 
} from "lucide-react";
import { getInitials, getYearBadgeColor } from "@/lib/utils/badge-helpers";

interface ColumnsConfig {
  onViewDetails: (accountId: string) => void;
  onViewReports: (accountId: string, name: string) => void;
  onDelete: (accountId: string, name: string, email: string) => void;
  isAdmin: boolean;
  currentAccountId: string | null;
}

export const createColumns = ({
  onViewDetails,
  onViewReports,
  onDelete,
  isAdmin,
  currentAccountId,
}: ColumnsConfig): ColumnDef<Student>[] => [
  {
    accessorKey: "NAME",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={student.AVATAR_URL} />
            <AvatarFallback className="bg-blue-500/10 text-blue-500">
              {getInitials(student.NAME)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.NAME}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {student.EMAIL}
            </div>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "STUDENT_ID",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("STUDENT_ID")}</span>
    ),
  },
  {
    accessorKey: "PROGRAM",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Program
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const program = row.getValue("PROGRAM") as string;
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="font-medium text-sm truncate max-w-[200px]">
              {program}
            </div>
          </TooltipTrigger>
          <TooltipContent>{program}</TooltipContent>
        </Tooltip>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "YEAR_OF_STUDY",
    header: "Year",
    cell: ({ row }) => {
      const year = row.getValue("YEAR_OF_STUDY") as number;
      return (
        <Badge className={getYearBadgeColor(year)}>
          Year {year}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id)?.toString());
    },
  },
  {
    accessorKey: "SEMESTER",
    header: "Semester",
    cell: ({ row }) => (
      <Badge variant="outline">
        Sem {row.getValue("SEMESTER")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id)?.toString());
    },
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
              <DropdownMenuItem onClick={() => onViewReports(student.ACCOUNT_ID, student.NAME)}>
                <FileText className="mr-2 h-4 w-4" />
                View Reports
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
