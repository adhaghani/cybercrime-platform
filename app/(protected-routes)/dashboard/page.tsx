"use client";

import { useState, useEffect, useCallback } from "react";
import { Crime, Facility, Announcement } from "@/lib/types";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { StaffDashboard } from "@/components/dashboard/staff-dashboard";
import { AnnouncementsSection } from "@/components/dashboard/announcements-section";
import { useAuth } from "@/lib/context/auth-provider";
import { Loader2 } from "lucide-react";
import { generateMetadata } from "@/lib/seo";

export default function DashboardPage() {
  const hasAnyRole = useHasAnyRole();
  const { claims } = useAuth();
  const UserAccounType = claims?.ACCOUNT_TYPE;
  const [reports, setReports] = useState<(Crime | Facility)[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isStudent = UserAccounType === 'STUDENT';
  const isStaff = hasAnyRole(['STAFF', 'SUPERVISOR']);
  const isAdmin = hasAnyRole(['ADMIN', 'SUPERADMIN']);
  
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [reportsRes, announcementsRes] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/announcements')
      ]);

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports || []);
      }

      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData.announcements || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (UserAccounType) {
      fetchDashboardData();
    }
  }, [UserAccounType, fetchDashboardData]);
  
  // Handle null role - user not authenticated or role not set
  if (UserAccounType === null || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your dashboard.
          </p>
        </div>
      </div>
    );
  }
  
  const crimeReports = reports.filter((r) => r.TYPE === "CRIME") as Crime[];
  const facilityReports = reports.filter((r) => r.TYPE === "FACILITY") as Facility[];
  const currentUserId = claims?.ACCOUNT_ID || '';
  const myReports = reports.filter((r) => r.SUBMITTED_BY === currentUserId);

  // Filter active announcements (published and within date range)
  const now = new Date();
  const activeAnnouncements = announcements
    .filter(a => 
      a.STATUS === 'PUBLISHED' && 
      new Date(a.START_DATE) <= now && 
      new Date(a.END_DATE) >= now
    )
    .sort((a, b) => {
      // Sort by priority
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.PRIORITY] - priorityOrder[a.PRIORITY];
    })
    .slice(0, 3); // Show top 3 announcements

  const stats = {
    totalCrime: crimeReports.length,
    totalFacility: facilityReports.length,
    myReports: myReports.length,
    pendingReports: myReports.filter(r => r.STATUS === "PENDING").length,
    resolvedReports: myReports.filter(r => r.STATUS === "RESOLVED").length,
    // System-wide stats for staff/admin
    allPending: reports.filter(r => r.STATUS === "PENDING").length,
    allInProgress: reports.filter(r => r.STATUS === "IN_PROGRESS").length,
    allResolved: reports.filter(r => r.STATUS === "RESOLVED").length,
    totalReports: reports.length,
  };

  generateMetadata({
    title: "Dashboard - Cybercrime Reporting Platform",
    description: isStudent
      ? "Welcome to your student dashboard on the Cybercrime Reporting Platform."
      : "Welcome to your staff dashboard on the Cybercrime Reporting Platform.",
    canonical: "/dashboard",
  });

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
      <AnnouncementsSection announcements={activeAnnouncements} />

      {/* Role-based Dashboard */}
      {isStudent ? (
        <StudentDashboard 
          stats={{
            totalCrime: stats.totalCrime,
            totalFacility: stats.totalFacility,
            myReports: stats.myReports,
            pendingReports: stats.pendingReports,
            resolvedReports: stats.resolvedReports,
          }}
          activeAnnouncementsCount={activeAnnouncements.length}
          reports={reports}
        />
      ) : (
        <StaffDashboard 
          stats={{
            totalCrime: stats.totalCrime,
            totalFacility: stats.totalFacility,
            allPending: stats.allPending,
            allInProgress: stats.allInProgress,
            allResolved: stats.allResolved,
            totalReports: stats.totalReports,
          }}
          isAdmin={isAdmin}
          reports={reports}
        />
      )}
    </div>
  );
}

