"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, Users, ArrowLeft, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/students/columns";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link";
import { Student } from "@/lib/types";
import { ViewUserDetailDialog } from "@/components/users/viewUserDetailDialog";
import { ViewStudentReportDialog } from "@/components/users/viewStudentReportDialog";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";
import { useAuth } from "@/lib/context/auth-provider";
import { toast } from "sonner";
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openReportsDialog, setOpenReportsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>("");
  const {claims} = useAuth();
  const ACCOUNT_ID = claims?.ACCOUNT_ID || null;
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleViewDetails = (accountId: string) => {
    setSelectedStudentId(accountId);
    setOpenViewDialog(true);
  };

  const handleViewReports = (accountId: string, name: string) => {
    setSelectedStudentId(accountId);
    setSelectedStudentName(name);
    setOpenReportsDialog(true);
  };

  const handleDeleteAccount = (accountId: string, name: string, email: string) => {
    setSelectedStudentId(accountId);
    setSelectedStudentName(name);
    setSelectedStudentEmail(email);
    setOpenDeleteDialog(true);
  };

  const handleRefreshStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      toast.error("Failed to refresh students. Please try again.");
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('/api/students/export');
      if (!response.ok) {
        throw new Error('Failed to export students data');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  }

  // Get unique programs for filter
  const Program = Array.from(new Set(students.map(s => s.PROGRAM)));
  const years = Array.from(new Set(students.map(s => s.YEAR_OF_STUDY)));
  const semesters = Array.from(new Set(students.map(s => s.SEMESTER)));

  const columns = useMemo(() => createColumns({
    onViewDetails: handleViewDetails,
    onViewReports: handleViewReports,
    onDelete: handleDeleteAccount,
    isAdmin: true,
    currentAccountId:ACCOUNT_ID
  }), [ACCOUNT_ID]);

  const filterableColumns = [
    {
      id: "PROGRAM",
      title: "Program",
      options: Program.map(p => ({label: p, value: p})),
    },
    {
      id: "YEAR_OF_STUDY",
      title: "Year",
      options: years.map(year => ({label: `Year ${year}`, value: year.toString()})),
    },
    {
      id: "SEMESTER",
      title: "Semester",
      options: semesters.map(sem => ({label: `Semester ${sem}`, value: sem.toString()})),
    }
  ]

   if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/user-management">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-500" />
            Students
          </h1>
          <p className="text-muted-foreground">
            Manage student accounts and academic information ({students.length} students)
          </p>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <p>Student List ({students.length})</p>
            <Button onClick={handleDownloadCSV} variant={"secondary"}>
              <Download className="h-4 w-4 mr-2" />
              Download as CSV
            </Button>
            </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users />
                </EmptyMedia>
                <EmptyTitle>No Students currently available</EmptyTitle>
                <EmptyDescription>
                  The system currently has no students. Try registering some students to populate this list.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DataTable
              columns={columns}
              data={students}
              searchKey="NAME"
              searchPlaceholder="Search by name, email, student ID, or program..."
              filterableColumns={filterableColumns}
            />
          )}
        </CardContent>
      </Card>
      {/* Dialogs */}
      <ViewUserDetailDialog
        accountId={selectedStudentId}
        open={openViewDialog}
        onOpenChange={setOpenViewDialog}
      />

      <ViewStudentReportDialog
        accountId={selectedStudentId}
        studentName={selectedStudentName}
        open={openReportsDialog}
        onOpenChange={setOpenReportsDialog}
      />

      <DeleteUserDialog
        accountId={selectedStudentId}
        userName={selectedStudentName}
        userEmail={selectedStudentEmail}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={handleRefreshStudents}
      />
    </div>
  );
}