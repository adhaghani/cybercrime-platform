"use client";

import { useState, useEffect } from "react";
import { Download,UserCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInitials, getYearBadgeColor } from "@/lib/utils/badge-helpers";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, Search, Filter, Mail, Phone, 
  GraduationCap, BookOpen, UserX, FileText
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link";
import { Student } from "@/lib/types";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { UITM_PROGRAMS } from "@/lib/constant";
import { ViewUserDetailDialog } from "@/components/users/viewUserDetailDialog";
import { ViewStudentReportDialog } from "@/components/users/viewStudentReportDialog";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";

const ITEMS_PER_PAGE = 10;

type YearFilter = "ALL" | "1" | "2" | "3" | "4";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<YearFilter>("ALL");
  const [programFilter, setProgramFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openReportsDialog, setOpenReportsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>("");

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

  // Get unique programs for filter
  const programs = UITM_PROGRAMS;

  const filteredStudents = students.length > 0 ? students.filter((student) => {
    const matchesSearch = 
      student.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.EMAIL.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.STUDENT_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.PROGRAM.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = yearFilter === "ALL" || student.YEAR_OF_STUDY.toString() === yearFilter;
    const matchesProgram = programFilter === "ALL" || student.PROGRAM === programFilter;

    return matchesSearch && matchesYear && matchesProgram;
  }) : [];

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

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
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('/api/students/export');
      if (response.ok) {
        const data = await response.blob();
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'students.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  }

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
            Manage student accounts and academic information ({filteredStudents.length} students)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, student ID, or program..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={yearFilter} onValueChange={(v) => handleFilterChange(() => setYearFilter(v as YearFilter))}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Year of study" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Years</SelectItem>
            <SelectItem value="1">Year 1</SelectItem>
            <SelectItem value="2">Year 2</SelectItem>
            <SelectItem value="3">Year 3</SelectItem>
            <SelectItem value="4">Year 4</SelectItem>
          </SelectContent>
        </Select>
        <Select value={programFilter} onValueChange={(v) => handleFilterChange(() => setProgramFilter(v))}>
          <SelectTrigger className="w-full md:w-[240px]">
            <BookOpen className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Programs</SelectItem>
            {programs.map((program) => (
              <SelectItem key={program} value={program}>
                {program}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <p>Student List ({filteredStudents.length})</p>
            <Button onClick={handleDownloadCSV} variant={"secondary"}>
              <Download  />
              Download as CSV</Button>
            </CardTitle>

        </CardHeader>
        <CardContent>
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Year/Semester</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.STUDENT_ID}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.AVATAR_URL} />
                        <AvatarFallback className="bg-blue-500/10 text-blue-500">{getInitials(student.NAME)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.NAME}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.EMAIL}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {student.STUDENT_ID}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{student.PROGRAM}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge className={getYearBadgeColor(student.YEAR_OF_STUDY)}>
                        Year {student.YEAR_OF_STUDY}
                      </Badge>
                      <Badge variant="outline">
                        Sem {student.SEMESTER}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {student.CONTACT_NUMBER}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            size={"icon-sm"}
                            onClick={() => handleViewDetails(student.ACCOUNT_ID)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          View Student Details
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            size={"icon-sm"}
                            onClick={() => handleViewReports(student.ACCOUNT_ID, student.NAME)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          View Student Reports
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            size={"icon-sm"}
                            className="bg-red-500/10 text-red-500 border-red-500 hover:bg-red-500/20 hover:text-red-500"
                            onClick={() => handleDeleteAccount(student.ACCOUNT_ID, student.NAME, student.EMAIL)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Delete Student Account
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {
            students.length === 0 && (
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
            )
          }
          {students.length !== 0 && filteredStudents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No students found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
          {paginatedStudents.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredStudents.length}
            />
          )}
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