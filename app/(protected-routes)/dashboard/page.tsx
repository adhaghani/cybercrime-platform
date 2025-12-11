"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { 
  ShieldAlert, 
  Wrench, 
  Phone, 
  TrendingUp, 
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Activity,
  MapPin,
  Users,
  BarChart3,
  Bell,
  Pin,
  Calendar,
  ImageIcon
} from "lucide-react";
import Link from "next/link";
import { MOCK_REPORTS, MOCK_ANNOUNCEMENTS } from "@/lib/api/mock-data";
import { CrimeReport } from "@/lib/types";
import { format } from "date-fns";
import { useHasAnyRole, useUserRole } from "@/hooks/use-user-role";

export default function DashboardPage() {
  const hasAnyRole = useHasAnyRole();
  const  role  = useUserRole();
  const isStudent = role === 'STUDENT';
  const isStaff = hasAnyRole(['STAFF']);
  const isAdmin = hasAnyRole(['ADMIN', 'SUPERADMIN']);
  
  const crimeReports = MOCK_REPORTS.filter((r) => r.type === "CRIME") as CrimeReport[];

  const myReports = MOCK_REPORTS.filter((r) => r.submittedBy === "user-1");
  const recentReports = [...myReports]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  // All reports for staff/admin
  const allRecentReports = [...MOCK_REPORTS]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  // Filter active announcements (published and within date range)
  const now = new Date();
  const activeAnnouncements = MOCK_ANNOUNCEMENTS
    .filter(a => 
      a.status === 'PUBLISHED' && 
      new Date(a.startDate) <= now && 
      new Date(a.endDate) >= now
    )
    .sort((a, b) => {
      // Pinned announcements first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by priority
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 3); // Show top 3 announcements

  const stats = {
    totalCrime: crimeReports.length,
    myReports: myReports.length,
    pendingReports: myReports.filter(r => r.status === "PENDING").length,
    resolvedReports: myReports.filter(r => r.status === "RESOLVED").length,
    // System-wide stats for staff/admin
    allPending: MOCK_REPORTS.filter(r => r.status === "PENDING").length,
    allInProgress: MOCK_REPORTS.filter(r => r.status === "IN_PROGRESS").length,
    allResolved: MOCK_REPORTS.filter(r => r.status === "RESOLVED").length,
    totalReports: MOCK_REPORTS.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RESOLVED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "LOW": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "EVENT": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "GENERAL": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {isStudent && "Welcome to the Campus Safety & Reporting Platform"}
          {isStaff && "Staff Dashboard - Monitor and manage campus reports"}
          {isAdmin && "Administrator Dashboard - System oversight and management"}
        </p>
      </div>

            {/* Announcements Section - Visible to All Users */}
      {activeAnnouncements.length > 0 && (
            <div className="space-y-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex flex-col items-start h-full gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  {announcement.image_src ? (
                    <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative">
                      <Image
                      width={200}
                      height={100}
                        src={announcement.image_src as string} 
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (                    <div className="grid place-items-center aspect-video w-full bg-muted rounded-md overflow-hidden relative">
                    <div className="text-center grid place-items-center space-y-2">
                    <ImageIcon  className="size-10 text-muted-foreground" />
                    <h3>No Image Provided</h3>
                    </div>
                    </div>)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {announcement.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                      <Link
                        href={`/dashboard/announcement/${announcement.id}`}
                        className="font-semibold hover:underline"
                      >
                        {announcement.title}
                      </Link>
                      <Badge className={getTypeColor(announcement.type)} variant="outline">
                        {announcement.type}
                      </Badge>
                      <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {announcement.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(announcement.startDate), "MMM d")} -{" "}
                        {format(new Date(announcement.endDate), "MMM d, yyyy")}
                      </span>
                      <span>Posted by {announcement.createdByName || "Unknown"}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/announcement/${announcement.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
      )}

      {/* Quick Stats - Different for Students vs Staff/Admin */}
      {isStudent ? (
        // Student Stats
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myReports}</div>
              <p className="text-xs text-muted-foreground">
                Total submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.resolvedReports}</div>
              <p className="text-xs text-muted-foreground">
                Successfully closed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAnnouncements.length}</div>
              <p className="text-xs text-muted-foreground">
                Active notifications
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Staff/Admin Stats
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
      )}



      <div className="grid gap-6 md:grid-cols-2 ">
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
                  {crimeReports.filter(r => r.submittedBy === "user-1").length}
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
            <CardTitle>
              {isStudent ? "My Recent Reports" : "Recent System Activity"}
            </CardTitle>
            <CardDescription>
              {isStudent ? "Your latest submissions" : "Latest reports across campus"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(isStudent ? recentReports : allRecentReports).length > 0 ? (
              <div className="space-y-4">
                {(isStudent ? recentReports : allRecentReports).map((report) => (
                  <div key={report.id} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0">
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
                        <Link href={`/dashboard/${report.type.toLowerCase()}/reports/${report.id}`}>
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

        {/* Quick Actions - Different for Students vs Staff/Admin */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              {isStudent ? "Common tasks" : "Management tools"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isStudent ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

