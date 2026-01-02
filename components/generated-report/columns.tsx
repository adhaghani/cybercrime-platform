"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GeneratedReport } from "@/lib/types";
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
  MoreHorizontal, Eye, Download, ArrowUpDown, Calendar
} from "lucide-react";
import { getCategoryColor, getGeneratedReportTypeColor } from "@/lib/utils/badge-helpers";
import Link from "next/link";
import { format } from "date-fns";

interface ColumnsConfig {
  onDownload: (report: GeneratedReport) => void;
  onDownloadTXT: (report: GeneratedReport) => void;
}

export const createColumns = ({
  onDownload,
  onDownloadTXT,
}: ColumnsConfig): ColumnDef<GeneratedReport>[] => [
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
      const report = row.original;
      return (
        <div>
          <Link
            href={`/dashboard/reports/report-summary/${report.GENERATE_ID}`}
            className="font-medium hover:underline"
          >
            {report.TITLE}
          </Link>
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
            {report.SUMMARY}
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "REPORT_CATEGORY",
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
      const category = row.getValue("REPORT_CATEGORY") as string;
      return (
        <Badge variant="outline" className={getCategoryColor(category)}>
          {category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "REPORT_DATA_TYPE",
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
      const type = row.getValue("REPORT_DATA_TYPE") as string;
      return (
        <Badge variant="outline" className={getGeneratedReportTypeColor(type)}>
          {type}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "ALL" || value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "DATE_RANGE_START",
    header: "Date Range",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>
            {format(new Date(report.DATE_RANGE_START), "MMM d")} -{" "}
            {format(new Date(report.DATE_RANGE_END), "MMM d, yyyy")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "REQUESTED_AT",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Generated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("REQUESTED_AT") as string);
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;

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
                <Link href={`/dashboard/reports/report-summary/${report.GENERATE_ID}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDownload(report)}>
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownloadTXT(report)}>
                <Download className="mr-2 h-4 w-4" />
                Download TXT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
