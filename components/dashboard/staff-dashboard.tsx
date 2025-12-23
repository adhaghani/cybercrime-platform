"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  Wrench, 
  Phone, 
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Activity,
  MapPin,
  Users,
  BarChart3,
  Bell
} from "lucide-react";
import Link from "next/link";
import { Crime, Facility, Report } from "@/lib/types";
import { format } from "date-fns";

interface StaffDashboardProps {
  stats: {
    totalCrime: number;
    totalFacility: number;
    allPending: number;
    allInProgress: number;
    allResolved: number;
    totalReports: number;
  };
  isAdmin: boolean;
  reports: (Crime | Facility)[];
}

export function StaffDashboard({ stats, isAdmin, reports }: StaffDashboardProps) {
  const allRecentReports = [...reports]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <>
      {/* Staff/Admin Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              All campus reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.allPending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.allInProgress}</div>
            <p className="text-xs text-muted-foreground">
              Being handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.allResolved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReports > 0 ? Math.round((stats.allResolved / stats.totalReports) * 100) : 0}% resolution rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Crime Reports Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
            <CardTitle>Crime Reports</CardTitle>
            <CardDescription>
              Monitor and manage crime incidents
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Reports</span>
                <Badge variant="outline">{stats.totalCrime}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                  {reports.filter(r => r.type === "CRIME" && r.status === "PENDING").length}
                </Badge>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/crime/reports">View All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Facility Reports Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle>Facility Reports</CardTitle>
            <CardDescription>
              Track facility issues and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Reports</span>
                <Badge variant="outline">{stats.totalFacility}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                  {MOCK_REPORTS.filter(r => r.type === "FACILITY" && r.status === "PENDING").length}
                </Badge>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/facility/reports">View All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Services Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Phone className="h-6 w-6 text-blue-500" />
            </div>
            <CardTitle>Emergency Services</CardTitle>
            <CardDescription>
              Manage emergency contacts and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">National Emergency</span>
                <Badge variant="destructive">999</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">UiTM Security</span>
                <Badge variant="outline">Campus-wide</Badge>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/emergency-services">
                Manage Contacts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest reports across campus</CardDescription>
          </CardHeader>
          <CardContent>
            {allRecentReports.length > 0 ? (
              <div className="space-y-4">
                {allRecentReports.map((report) => (
                  <div key={report.reportId} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                        <p className="font-medium text-sm line-clamp-1">{report.title}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(report.submittedAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.replace("_", " ")}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/${report.type.toLowerCase()}/reports/${report.reportId}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No reports in the system yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/crime/reports">
                <ShieldAlert className="h-4 w-4 mr-2" />
                All Crime Reports
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/facility/reports">
                <Wrench className="h-4 w-4 mr-2" />
                All Facility Reports
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/announcement">
                <Bell className="h-4 w-4 mr-2" />
                Manage Announcements
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/crime/statistics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Statistics
              </Link>
            </Button>
            {isAdmin && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/user-management">
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/emergency-services">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Services
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
