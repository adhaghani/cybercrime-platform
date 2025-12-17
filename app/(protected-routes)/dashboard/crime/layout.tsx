"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  PlusCircle, 
  FileText, 
  ClipboardList, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/statusBadge";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { Crime } from "@/lib/types";


export default function CrimeLayout({ children }: { children: React.ReactNode }) {

  // Get user's crime reports
  const myReports = MOCK_REPORTS.filter(
    (r) => r.type === "CRIME" && r.submittedBy === "user-1"
  ) as Crime[];

  const stats = {
    total: myReports.length,
    pending: myReports.filter(r => r.status === "PENDING").length,
    inProgress: myReports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: myReports.filter(r => r.status === "RESOLVED").length,
  };

  // Get recent reports (last 3)
  const recentReports = [...myReports]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  // Student navigation items
  const studentNavItems = [
    {
      href: "/dashboard/crime/submit-report",
      icon: PlusCircle,
      label: "Submit Report",
      variant: "default" as const,
    },
    {
      href: "/dashboard/crime/my-reports",
      icon: FileText,
      label: "My Reports",
      variant: "outline" as const,
    },
    {
      href: "/dashboard/crime/reports",
      icon: ClipboardList,
      label: "All Reports",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">{children}</div>
      
      <aside className="w-full h-fit sticky top-16 lg:w-80 shrink-0 space-y-6">
        {/* Quick Navigation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {studentNavItems.map((item) => (
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
              Your Statistics
            </CardTitle>
            <CardDescription>
              Overview of your reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Reports</span>
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Pending</span>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  {stats.pending}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span>In Progress</span>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  {stats.inProgress}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Resolved</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  {stats.resolved}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Reports</CardTitle>
              <CardDescription>Your latest submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={report.reportId}>
                  <Link 
                    href={`/dashboard/crime/reports/${report.reportId}`}
                    className="block hover:bg-accent/50 -mx-2 px-2 py-2 rounded-md transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium line-clamp-1">{report.title}</p>
                      <StatusBadge status={report.status} />
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
