"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInitials, getYearBadgeColor } from "@/lib/utils/badge-helpers";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, Search, Filter, MoreVertical, Mail, Phone, 
  GraduationCap, BookOpen, Edit, UserX, FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Student } from "@/lib/types";
import { PaginationControls } from "@/components/ui/pagination-controls";

const ITEMS_PER_PAGE = 10;

// Extended mock student data
const MOCK_STUDENTS: Student[] = [
  {
    accountId: "stu-1",
    email: "ahmad.ali@student.uitm.edu.my",
    name: "Ahmad Ali bin Abdullah",
    contactNumber: "012-3456789",
    accountType: "STUDENT",
    studentId: "2023123456",
    program: "CS240 - Computer Science",
    semester: 4,
    yearOfStudy: 2,
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "stu-2",
    email: "sarah.wong@student.uitm.edu.my",
    name: "Sarah Wong Li Ying",
    contactNumber: "012-9876543",
    accountType: "STUDENT",
    studentId: "2023123457",
    program: "IT245 - Information Technology",
    semester: 6,
    yearOfStudy: 3,
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "stu-3",
    email: "john.tan@student.uitm.edu.my",
    name: "John Tan Wei Ming",
    contactNumber: "013-2468135",
    accountType: "STUDENT",
    studentId: "2024135791",
    program: "SE250 - Software Engineering",
    semester: 2,
    yearOfStudy: 1,
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "stu-4",
    email: "nurul.aisyah@student.uitm.edu.my",
    name: "Nurul Aisyah binti Hassan",
    contactNumber: "019-8765432",
    accountType: "STUDENT",
    studentId: "2022098765",
    program: "CS240 - Computer Science",
    semester: 8,
    yearOfStudy: 4,
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "stu-5",
    email: "david.lim@student.uitm.edu.my",
    name: "David Lim Chee Kong",
    contactNumber: "016-7654321",
    accountType: "STUDENT",
    studentId: "2024123789",
    program: "IM246 - Information Management",
    semester: 1,
    yearOfStudy: 1,
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "stu-6",
    email: "fatimah.zahra@student.uitm.edu.my",
    name: "Fatimah Zahra binti Ahmad",
    contactNumber: "017-5556789",
    accountType: "STUDENT",
    studentId: "2023234567",
    program: "IT245 - Information Technology",
    semester: 5,
    yearOfStudy: 3,
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type YearFilter = "ALL" | "1" | "2" | "3" | "4";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<YearFilter>("ALL");
  const [programFilter, setProgramFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [students] = useState<Student[]>(MOCK_STUDENTS);

  // Get unique programs for filter
  const programs = Array.from(new Set(students.map(s => s.program)));

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.program.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = yearFilter === "ALL" || student.yearOfStudy.toString() === yearFilter;
    const matchesProgram = programFilter === "ALL" || student.program === programFilter;

    return matchesSearch && matchesYear && matchesProgram;
  });

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
          <CardTitle>Student List ({filteredStudents.length})</CardTitle>
          {totalPages > 1 && paginatedStudents.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredStudents.length}
            />
          )}
        </CardHeader>
        <CardContent>
          <Table>
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
                <TableRow key={student.accountId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {student.studentId}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{student.program}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge className={getYearBadgeColor(student.yearOfStudy)}>
                        Year {student.yearOfStudy}
                      </Badge>
                      <Badge variant="outline">
                        Sem {student.semester}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {student.contactNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Reports
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Academic Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No students found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}