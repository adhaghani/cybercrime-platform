"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInitials, getDepartmentColor } from "@/lib/utils/badge-helpers";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft, Search, MoreVertical, Mail, Phone, 
  ShieldCheck,  Edit, UserX, Shield, ShieldAlert, Plus
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

const ITEMS_PER_PAGE = 10;

// Mock administrator data - these are staff with ADMIN role
const MOCK_ADMINISTRATORS: Staff[] = [
  {
    accountId: "admin-1",
    email: "rahman.admin@uitm.edu.my",
    passwordHash: "",
    accountType: "STAFF",
    name: "Encik Rahman Ibrahim",
    contactNumber: "019-3334567",
    role: "ADMIN",
    staffId: "A10001",
    department: "System Administration",
    position: "System Administrator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "admin-2",
    email: "fatimah.admin@uitm.edu.my",
    passwordHash: "",
    accountType: "STAFF",
    name: "Puan Fatimah Zahra binti Hassan",
    contactNumber: "012-8887654",
    role: "ADMIN",
    staffId: "A10002",
    department: "Campus Security",
    position: "Security Administrator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "admin-3",
    email: "wong.admin@uitm.edu.my",
    passwordHash: "",
    accountType: "STAFF",
    name: "Mr. Wong Chen Wei",
    contactNumber: "013-5554321",
    role: "ADMIN",
    staffId: "A10003",
    department: "IT Services",
    position: "IT Administrator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "admin-4",
    email: "azman.admin@uitm.edu.my",
    passwordHash: "",
    accountType: "STAFF",
    name: "Encik Azman bin Yusof",
    contactNumber: "017-2221098",
    role: "ADMIN",
    staffId: "A10004",
    department: "Facilities Management",
    position: "Facilities Administrator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    accountId: "admin-5",
    email: "priya.admin@uitm.edu.my",
    passwordHash: "",
    accountType: "STAFF",
    name: "Dr. Priya Devi a/p Subramaniam",
    contactNumber: "016-9998765",
    role: "ADMIN",
    staffId: "A10005",
    department: "Academic Affairs",
    position: "Academic Administrator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function AdministratorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [administrators] = useState<Staff[]>(MOCK_ADMINISTRATORS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAdministrators = administrators.filter((admin) => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.position.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAdministrators.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAdministrators = filteredAdministrators.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRevokeAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to revoke admin privileges? This user will be demoted to regular staff.")) {
      // TODO: API call to revoke admin privileges
      console.log("Revoking admin privileges:", adminId);
      alert("Admin revocation functionality will be implemented with backend API");
    }
  };

  const handleResetPassword = (adminId: string) => {
    // TODO: API call to reset password
    console.log("Resetting password for admin:", adminId);
    alert("Password reset link will be sent to the administrator's email");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/user-management">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-purple-500" />
              Administrators
            </h1>
            <p className="text-muted-foreground">
              Manage system administrators and their privileges ({filteredAdministrators.length} administrators)
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Administrator
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="border-purple-500/20 bg-purple-500/5">
        <CardHeader>
          <div className="flex items-start gap-4">
            <ShieldAlert className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <CardTitle className="text-base">Administrator Access</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Administrators have elevated privileges including user management, report oversight, 
                and system configuration. Exercise caution when granting or revoking admin access.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search administrators by name, email, staff ID, department, or position..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Administrators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator List ({filteredAdministrators.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Administrator</TableHead>
                <TableHead>Staff ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAdministrators.map((admin) => (
                <TableRow key={admin.accountId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={admin.avatarUrl} />
                        <AvatarFallback className="bg-purple-500/10 text-purple-500">
                          {getInitials(admin.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {admin.name}
                          <Badge variant="outline" className="text-purple-500 border-purple-500/50">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {admin.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {admin.staffId}
                  </TableCell>
                  <TableCell>
                    <Badge className={getDepartmentColor(admin.department)}>
                      {admin.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{admin.position}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {admin.contactNumber}
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
                          <Shield className="h-4 w-4 mr-2" />
                          View Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(admin.accountId)}>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRevokeAdmin(admin.accountId)}
                          className="text-destructive"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Revoke Admin Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedAdministrators.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No administrators found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {filteredAdministrators.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}