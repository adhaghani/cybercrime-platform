"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Crime } from "@/lib/types";
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
  MoreHorizontal, Eye, UserPlus, ArrowUpDown
} from "lucide-react";
import { format } from "date-fns";
import CrimeCategoryBadge from "@/components/ui/crimeCategoryBadge";
import StatusBadge from "@/components/ui/statusBadge";

interface ColumnsConfig {
  onViewDetails: (id: string) => void;
  onAssign: (id: string) => void;
}

export const createColumns = ({
  onViewDetails,
  onAssign,
}: ColumnsConfig): ColumnDef<Crime>[] => [
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
      const crime = row.original;
      return <div className="font-medium">{crime.TITLE}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "CRIME_CATEGORY",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue("CRIME_CATEGORY") as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <CrimeCategoryBadge category={category as any} />;
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "LOCATION",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("LOCATION") as string;
      return <div className="text-sm">{location}</div>;
    },
  },
  {
    accessorKey: "SUBMITTED_AT",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("SUBMITTED_AT") as string);
      return <div className="text-sm">{format(date, "MMM d, yyyy")}</div>;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <StatusBadge status={status as any} />;
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const crime = row.original;

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
              <DropdownMenuItem onClick={() => onViewDetails(crime.REPORT_ID)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {crime.STATUS !== "RESOLVED" && crime.STATUS !== "REJECTED" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onAssign(crime.REPORT_ID)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Staff
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
