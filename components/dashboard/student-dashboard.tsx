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
  ArrowRight,
  MapPin,
  Bell
} from "lucide-react";
import Link from "next/link";
import { Crime, Facility } from "@/lib/types";
import { format } from "date-fns";
import { useAuth } from "@/lib/context/auth-provider";

interface StudentDashboardProps {
  stats: {
    totalCrime: number;
    totalFacility: number;
    myReports: number;
    pendingReports: number;
    resolvedReports: number;
  };
  activeAnnouncementsCount: number;
  reports: (Crime | Facility)[];
}

export function StudentDashboard({ stats, reports }: StudentDashboardProps) {
  const { claims } = useAuth();
  const currentUserId = claims?.sub || '';
  
  const crimeReports = reports.filter((r) => r.type === "CRIME") as Crime[];
  const facilityReports = reports.filter((r) => r.type === "FACILITY") as Facility[];
  
  const myReports = reports.filter((r) => r.submittedBy === currentUserId);
  const recentReports = [...myReports]
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
              Report and track crime incidents on campus
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Reports</span>
                <Badge variant="outline">{stats.totalCrime}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">My Reports</span>
                <Badge variant="outline">
                  {crimeReports.filter(r => r.submittedBy === currentUserId).length}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href="/dashboard/crime/submit-report">Submit</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard/crime">View All</Link>
              </Button>
            </div>
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
              Report facility issues and maintenance needs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Reports</span>
                <Badge variant="outline">{stats.totalFacility}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">My Reports</span>
                <Badge variant="outline">
                  {facilityReports.filter(r => r.submittedBy === currentUserId).length}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href="/dashboard/facility/submit-report">Submit</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard/facility">View All</Link>
              </Button>
            </div>
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
              Access emergency contacts and resources
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
                View Contacts
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
            <CardTitle>My Recent Reports</CardTitle>
            <CardDescription>Your latest submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
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
                <p>No reports submitted yet.</p>
                <p className="text-sm mt-2">Start by submitting a crime or facility report.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/crime/submit-report">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Report Crime
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/facility/submit-report">
                <Wrench className="h-4 w-4 mr-2" />
                Report Facility Issue
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/announcement">
                <Bell className="h-4 w-4 mr-2" />
                View Announcements
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/crime/statistics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Statistics
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/emergency-services">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Contacts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
