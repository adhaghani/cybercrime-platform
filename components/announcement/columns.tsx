/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Announcement } from "@/lib/types";
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
  MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown 
} from "lucide-react";
import { getPriorityColor, getAnnouncementTypeColor } from "@/lib/utils/badge-helpers";
import Link from "next/link";

interface ColumnsConfig {
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  hasManageAccess: boolean;
}

export const createColumns = ({
  onDelete,
  hasManageAccess,
}: ColumnsConfig): ColumnDef<Announcement>[] => [
  {
    accessorKey: "TITLE",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const announcement = row.original;
      return (
        <Link
          href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}`}
          className="font-medium hover:underline"
        >
          {announcement.TITLE}
        </Link>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "TYPE",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("TYPE") as string;
      return (
        <Badge className={getAnnouncementTypeColor(type)} variant="outline">
          {type}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "AUDIENCE",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Audience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("AUDIENCE")}</Badge>
    ),
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "PRIORITY",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("PRIORITY") as string;
      return (
        <Badge className={getPriorityColor(priority)} variant="outline">
          {priority}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "START_DATE",
    header: "Date Range",
    cell: ({ row }) => {
      const announcement = row.original;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(announcement.START_DATE).toLocaleDateString()} - 
          {new Date(announcement.END_DATE).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "STATUS",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("STATUS") as string;
      return (
        <Badge 
          className={status === 'PUBLISHED' ? "bg-green-500/10 border-green-700 text-green-700" : ""} 
          variant="outline"
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  ...(hasManageAccess ? [{
    id: "actions" as const,
    cell: ({ row }: { row: any }) => {
      const announcement = row.original;

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
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/announcement/${announcement.ANNOUNCEMENT_ID}/update`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Announcement
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(announcement.ANNOUNCEMENT_ID, announcement.TITLE)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Announcement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  }] : []),
];
