/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye} from "lucide-react";

import Link from "next/link";

import StatusBadge from "@/components/ui/statusBadge";
export const createColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "TITLE",
    header: "Report",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        {row.getValue("TITLE")}
      </div>
    ),
  },
  {
    accessorKey: "TYPE",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("TYPE") as string;
      return (
        <Badge variant={"outline"}>
          {type}
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
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        {row.getValue("LOCATION")}
      </div>
    ),
  },
  {
    accessorKey: "ASSIGNED_AT",
    header: "Assigned",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        {new Date(row.getValue("ASSIGNED_AT")).toLocaleDateString()}
      </div>
    ),
  },
    {
    accessorKey: "STATUS",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <StatusBadge status={row.getValue("STATUS")} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex justify-end">
          <Button asChild variant="outline" size={"sm"}>
            <Link href={`/dashboard/reports/${member.REPORT_ID}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Report
            </Link>
          </Button>
        </div>
      );
    },
  },
];
