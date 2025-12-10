"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  PlusCircle, 
  FileText, 
  ClipboardList, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { FacilityReport } from "@/lib/types";
import { useHasAnyRole } from "@/hooks/use-user-role";

export default function FacilityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasAnyRole = useHasAnyRole();
  const isStaffOrAdmin = hasAnyRole(['STAFF', 'ADMIN', 'SUPERADMIN']);
  
  // Get user's facility reports
  const myReports = MOCK_REPORTS.filter(
    (r) => r.type === "FACILITY" && r.submittedBy === "user-1"
  ) as FacilityReport[];

  // Get all facility reports for staff/admin
  const allFacilityReports = MOCK_REPORTS.filter(
    (r) => r.type === "FACILITY"
  ) as FacilityReport[];

  const stats = {
    total: myReports.length,
    pending: myReports.filter(r => r.status === "PENDING").length,
    inProgress: myReports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: myReports.filter(r => r.status === "RESOLVED").length,
  };

  // Staff/Admin stats for all reports
  const allStats = {
    total: allFacilityReports.length,
    pending: allFacilityReports.filter(r => r.status === "PENDING").length,
    inProgress: allFacilityReports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: allFacilityReports.filter(r => r.status === "RESOLVED").length,
  };

  // Get recent reports (last 3)
  const recentReports = [...myReports]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  // Student navigation items
  const studentNavItems = [
    {
      href: "/dashboard/facility/submit-report",
      icon: PlusCircle,
      label: "Submit Report",
      variant: "default" as const,
    },
    {
      href: "/dashboard/facility/my-reports",
      icon: FileText,
      label: "My Reports",
      variant: "outline" as const,
    },
    {
      href: "/dashboard/facility/reports",
      icon: ClipboardList,
      label: "All Reports",
      variant: "outline" as const,
    },
  ];

  // Staff/Admin navigation items with additional quick actions
  const staffNavItems = [
    {
      href: "/dashboard/facility/reports",
      icon: ClipboardList,
      label: "All Reports",
      variant: "default" as const,
    },
    {
      href: "/dashboard/facility/my-reports",
      icon: FileText,
      label: "My Reports",
      variant: "outline" as const,
    },
    {
      href: "/dashboard/facility/submit-report",
      icon: PlusCircle,
      label: "Submit Report",
      variant: "outline" as const,
    },
  ];

  const navigationItems = isStaffOrAdmin ? staffNavItems : studentNavItems;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">{children}</div>
      
      <aside className="w-full h-fit sticky top-16 lg:w-80 shrink-0 space-y-6">
        {/* Quick Navigation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={item.variant}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isStaffOrAdmin ? "System Statistics" : "Your Statistics"}
            </CardTitle>
            <CardDescription>
              {isStaffOrAdmin ? "Overview of all facility reports" : "Overview of your reports"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Reports</span>
              <span className="text-2xl font-bold">{isStaffOrAdmin ? allStats.total : stats.total}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Pending</span>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  {isStaffOrAdmin ? allStats.pending : stats.pending}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span>In Progress</span>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  {isStaffOrAdmin ? allStats.inProgress : stats.inProgress}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Resolved</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  {isStaffOrAdmin ? allStats.resolved : stats.resolved}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Data Card for Staff/Admin */}
        {isStaffOrAdmin && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Issues</span>
                <span className="text-lg font-bold text-yellow-500">
                  {allStats.pending + allStats.inProgress}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resolution Rate</span>
                <span className="text-lg font-bold text-green-500">
                  {allStats.total > 0 
                    ? Math.round((allStats.resolved / allStats.total) * 100) 
                    : 0}%
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Needs Attention</span>
                <span className="text-lg font-bold text-red-500">
                  {allStats.pending}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reports */}
        {recentReports.length > 0 && !isStaffOrAdmin && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Reports</CardTitle>
              <CardDescription>Your latest submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={report.id}>
                  <Link 
                    href={`/dashboard/facility/reports/${report.id}`}
                    className="block hover:bg-accent/50 -mx-2 px-2 py-2 rounded-md transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium line-clamp-1">{report.title}</p>
                      <Badge className={`${getStatusColor(report.status)} text-xs shrink-0`}>
                        {report.status === "IN_PROGRESS" ? "In Progress" : report.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {report.location}
                    </p>
                  </Link>
                  {index < recentReports.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}
       