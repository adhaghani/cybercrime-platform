"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInitials, getDepartmentColor } from "@/lib/utils/badge-helpers";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import { 
  ArrowLeft, Search, MoreVertical, Mail, Phone, 
  Briefcase, Building2, UserX, Shield, UserPlus,
  ShieldCheck,
  UserCheck,
  Download
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
import { ViewUserDetailDialog } from "@/components/users/viewUserDetailDialog";
import { ViewStaffAssignmentDialog } from "@/components/users/viewStaffAssignmentDialog";
import { PromoteStaffDialog } from "@/components/users/promoteStaffDialog";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";
import { useAuth } from "@/lib/context/auth-provider";
import { useHasAnyRole } from "@/hooks/use-user-role";

const ITEMS_PER_PAGE = 10;

export default function StaffManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAssignmentsDialog, setOpenAssignmentsDialog] = useState(false);
  const [openPromoteDialog, setOpenPromoteDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedStaffName, setSelectedStaffName] = useState<string>("");
  const [selectedStaffEmail, setSelectedStaffEmail] = useState<string>("");
  const {claims} = useAuth();
  const ACCOUNT_ID = claims?.ACCOUNT_ID || null;
  const hasAnyRole = useHasAnyRole();

  const isAdmin = hasAnyRole(['ADMIN', 'SUPERADMIN']);
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaffMembers(data.staff || []);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('/api/staff/export');
      if (response.ok) {
        const data = await response.blob();
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'staff_members.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  }
  // Get unique departments for filter
  const departments = Array.from(new Set(staffMembers.map(s => s.DEPARTMENT)));

  const filteredStaff = staffMembers.filter((member) => {
    const matchesSearch = 
      member.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.EMAIL.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.DEPARTMENT.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.POSITION.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = departmentFilter === "ALL" || member.DEPARTMENT === departmentFilter;
    const matchesRole = roleFilter === "ALL" || member.ROLE === roleFilter;

    return matchesSearch && matchesDepartment && matchesRole;
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

  const handleViewDetails = (accountId: string) => {
    setSelectedStaffId(accountId);
    setOpenViewDialog(true);
  };

  const handleViewAssignments = (accountId: string, name: string) => {
    setSelectedStaffId(accountId);
    setSelectedStaffName(name);
    setOpenAssignmentsDialog(true);
  };

  const handlePromoteToAdmin = (accountId: string, name: string) => {
    setSelectedStaffId(accountId);
    setSelectedStaffName(name);
    setOpenPromoteDialog(true);
  };

  const handleDeleteAccount = (accountId: string, name: string, email: string) => {
    setSelectedStaffId(accountId);
    setSelectedStaffName(name);
    setSelectedStaffEmail(email);
    setOpenDeleteDialog(true);
  };

  const handleRefreshStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaffMembers(data.staff || []);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex justify-between items-center gap-4">
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
        <Button asChild>
          <Link href="/dashboard/user-management/staff/add">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Staff
          </Link>
        </Button>
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
        <Select value={roleFilter} onValueChange={(v) => handleFilterChange(() => setRoleFilter(v))}>
          <SelectTrigger className="w-full md:w-[180px]">
            <ShieldCheck className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
          </SelectContent>
        </Select>
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
          <CardTitle className="flex items-center gap-2 justify-between">
            <p>Staff List ({filteredStaff.length})</p>
            {isAdmin && <Button onClick={handleDownloadCSV} variant={"secondary"}>
              <Download  />
              Download as CSV</Button>}
            </CardTitle>

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
                <TableRow key={member.ACCOUNT_ID}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.AVATAR_URL} />
                        <AvatarFallback className="bg-green-500/10 text-green-500">{getInitials(member.NAME)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex gap-1 items-center">
                          <p>
                          {member.NAME}
                          </p>
                          <p>
                            <Badge variant="outline" className={getDepartmentColor(member.DEPARTMENT) + " text-green-500 border-green-500/50"}>
                              {member.ROLE}
                            </Badge>
                          </p>
                          </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.EMAIL}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {member.STAFF_ID}
                  </TableCell>
                  <TableCell>
                    <Badge className={getDepartmentColor(member.DEPARTMENT)}>
                      {member.DEPARTMENT}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{member.POSITION}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {member.CONTACT_NUMBER}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(member.ACCOUNT_ID)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Staff Details
                        </DropdownMenuItem>
                        {ACCOUNT_ID !== member.ACCOUNT_ID && <>
                        <DropdownMenuItem onClick={() => handleViewAssignments(member.ACCOUNT_ID, member.NAME)}>
                          <Briefcase className="h-4 w-4 mr-2" />
                          View Assignments
                        </DropdownMenuItem>
                        {isAdmin && <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.ACCOUNT_ID, member.NAME)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Promote Staff
                        </DropdownMenuItem>}
                        </>}
                        <DropdownMenuSeparator />

                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteAccount(member.ACCOUNT_ID, member.NAME, member.EMAIL)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Delete Account
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
          {paginatedStaff.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredStaff.length}
            />
          )}
      {/* Dialogs */}
      <ViewUserDetailDialog
        accountId={selectedStaffId}
        open={openViewDialog}
        onOpenChange={setOpenViewDialog}
      />

      <ViewStaffAssignmentDialog
        accountId={selectedStaffId}
        staffName={selectedStaffName}
        open={openAssignmentsDialog}
        onOpenChange={setOpenAssignmentsDialog}
      />

      <PromoteStaffDialog
        accountId={selectedStaffId}
        staffName={selectedStaffName}
        open={openPromoteDialog}
        onOpenChange={setOpenPromoteDialog}
        onSuccess={handleRefreshStaff}
      />

      <DeleteUserDialog
        accountId={selectedStaffId}
        userName={selectedStaffName}
        userEmail={selectedStaffEmail}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={handleRefreshStaff}
      />    </div>
  );
}