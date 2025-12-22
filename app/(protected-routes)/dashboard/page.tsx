"use client";

import { MOCK_REPORTS, MOCK_ANNOUNCEMENTS } from "@/lib/api/mock-data";
import { Crime, Facility } from "@/lib/types";
import { useHasAnyRole, useUserRole } from "@/hooks/use-user-role";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { StaffDashboard } from "@/components/dashboard/staff-dashboard";
import { AnnouncementsSection } from "@/components/dashboard/announcements-section";

export default function DashboardPage() {
  const hasAnyRole = useHasAnyRole();
  const role = useUserRole();
  const isStudent = role === 'STUDENT';
  const isStaff = hasAnyRole(['STAFF']);
  const isAdmin = hasAnyRole(['ADMIN', 'SUPERADMIN']);
  
  // Handle null role - user not authenticated or role not set
  if (role === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your account information.
          </p>
        </div>
      </div>
    );
  }
  
  const crimeReports = MOCK_REPORTS.filter((r) => r.type === "CRIME") as Crime[];
  const facilityReports = MOCK_REPORTS.filter((r) => r.type === "FACILITY") as Facility[];
  
  const myReports = MOCK_REPORTS.filter((r) => r.submittedBy === "user-1");

  // Filter active announcements (published and within date range)
  const now = new Date();
  const activeAnnouncements = MOCK_ANNOUNCEMENTS
    .filter(a => 
      a.status === 'PUBLISHED' && 
      new Date(a.startDate) <= now && 
      new Date(a.endDate) >= now
    )
    .sort((a, b) => {
      // Sort by priority
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 3); // Show top 3 announcements

  const stats = {
    totalCrime: crimeReports.length,
    totalFacility: facilityReports.length,
    myReports: myReports.length,
    pendingReports: myReports.filter(r => r.status === "PENDING").length,
    resolvedReports: myReports.filter(r => r.status === "RESOLVED").length,
    // System-wide stats for staff/admin
    allPending: MOCK_REPORTS.filter(r => r.status === "PENDING").length,
    allInProgress: MOCK_REPORTS.filter(r => r.status === "IN_PROGRESS").length,
    allResolved: MOCK_REPORTS.filter(r => r.status === "RESOLVED").length,
    totalReports: MOCK_REPORTS.length,
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
        />
      )}
    </div>
  );
}

