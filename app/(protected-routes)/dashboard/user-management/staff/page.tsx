"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInitials, getDepartmentColor } from "@/lib/utils/badge-helpers";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, Search, MoreVertical, Mail, Phone, 
  Briefcase, Building2, Edit, UserX, Shield
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
import { Staff } from "@/lib/types";
import { PaginationControls } from "@/components/ui/pagination-controls";

const ITEMS_PER_PAGE = 10;

// Extended mock staff data
const MOCK_STAFF_MEMBERS: Staff[] = [
  {
    accountId: "staff-1",
    email: "abu.bakar@uitm.edu.my",
    name: "Officer Abu Bakar bin Sulaiman",
    contactNumber: "013-9876543",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12345",
    department: "Campus Security",
    position: "Patrol Officer",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "staff-2",
    email: "siti.nurhaliza@uitm.edu.my",
    name: "Dr. Siti Nurhaliza binti Mohamed",
    contactNumber: "012-5556789",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12346",
    department: "Computer Science",
    position: "Senior Lecturer",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "staff-3",
    email: "ali.imran@uitm.edu.my",
    name: "Encik Ali Imran bin Rahman",
    contactNumber: "019-2223456",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12347",
    department: "Facilities Management",
    position: "Maintenance Supervisor",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "staff-4",
    email: "maria.abdullah@uitm.edu.my",
    name: "Puan Maria binti Abdullah",
    contactNumber: "017-8889012",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12348",
    department: "Student Affairs",
    position: "Student Counselor",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "staff-5",
    email: "kumar.rajan@uitm.edu.my",
    name: "Dr. Kumar a/l Rajan",
    contactNumber: "016-4445678",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12349",
    department: "Information Technology",
    position: "Associate Professor",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "staff-6",
    email: "lim.mei.ling@uitm.edu.my",
    name: "Ms. Lim Mei Ling",
    contactNumber: "012-1112345",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12350",
    department: "Library Services",
    position: "Head Librarian",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "staff-7",
    email: "hassan.mahmud@uitm.edu.my",
    name: "Encik Hassan bin Mahmud",
    contactNumber: "019-7778901",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12351",
    department: "Campus Security",
    position: "Security Manager",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "staff-8",
    email: "noor.azlina@uitm.edu.my",
    name: "Dr. Noor Azlina binti Ismail",
    contactNumber: "013-6667890",
    accountType: "STAFF",
    role: "STAFF",
    staffId: "S12352",
    department: "Software Engineering",
    position: "Lecturer",
    passwordHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [staff] = useState<Staff[]>(MOCK_STAFF_MEMBERS);

  // Get unique departments for filter
  const departments = Array.from(new Set(staff.map(s => s.department)));

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = departmentFilter === "ALL" || member.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const handlePromoteToAdmin = (staffId: string) => {
    // TODO: API call to promote staff to admin
    console.log("Promoting staff to admin:", staffId);
    alert("Promotion functionality will be implemented with backend API");
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
            <Briefcase className="h-8 w-8 text-green-500" />
            Staff Members
          </h1>
          <p className="text-muted-foreground">
            Manage staff accounts and department information ({filteredStaff.length} staff members)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, staff ID, department, or position..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={departmentFilter} onValueChange={(v) => handleFilterChange(() => setDepartmentFilter(v))}>
          <SelectTrigger className="w-full md:w-[240px]">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff List ({filteredStaff.length})</CardTitle>
          {totalPages > 1 && paginatedStaff.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredStaff.length}
            />
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Staff ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaff.map((member) => (
                <TableRow key={member.accountId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {member.staffId}
                  </TableCell>
                  <TableCell>
                    <Badge className={getDepartmentColor(member.department)}>
                      {member.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{member.position}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {member.contactNumber}
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
                          <Briefcase className="h-4 w-4 mr-2" />
                          View Assignments
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.accountId)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Promote to Admin
                        </DropdownMenuItem>
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

          {filteredStaff.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No staff members found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}