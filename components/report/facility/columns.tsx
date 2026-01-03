"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Facility } from "@/lib/types";
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
import StatusBadge from "@/components/ui/statusBadge";
import { Badge } from "@/components/ui/badge";

interface ColumnsConfig {
  onViewDetails: (id: string) => void;
  onAssign: (id: string) => void;
}

export const createColumns = ({
  onViewDetails,
  onAssign,
}: ColumnsConfig): ColumnDef<Facility>[] => [
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
      const facility = row.original;
      return <div className="font-medium">{facility.TITLE}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "FACILITY_TYPE",
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
      const type = row.getValue("FACILITY_TYPE") as string;
      return (
        <Badge variant="outline">
          {type}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "SEVERITY_LEVEL",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Severity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const severity = row.getValue("SEVERITY_LEVEL") as string;
      const colors: Record<string, string> = {
        LOW: "bg-green-100 text-green-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HIGH: "bg-orange-100 text-orange-800",
        CRITICAL: "bg-red-100 text-red-800",
      };
      return (
        <Badge variant="outline" className={colors[severity] || ""}>
          {severity}
        </Badge>
      );
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
      const facility = row.original;

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
              <DropdownMenuItem onClick={() => onViewDetails(facility.REPORT_ID)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {facility.STATUS !== "RESOLVED" && facility.STATUS !== "REJECTED" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onAssign(facility.REPORT_ID)}>
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
