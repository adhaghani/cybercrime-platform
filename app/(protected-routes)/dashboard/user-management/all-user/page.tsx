"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, Search, Filter, MoreVertical, Mail, Phone, 
  UserCheck, UserX, Edit, Trash2 
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
import { Account, Student, Staff } from "@/lib/types";

// Extended mock data - replace with API calls
const MOCK_ALL_USERS: (Student | Staff)[] = [
  {
    id: "user-1",
    email: "ahmad.ali@student.uitm.edu.my",
    name: "Ahmad Ali bin Abdullah",
    contactNumber: "012-3456789",
    role: "STUDENT",
    studentId: "2023123456",
    program: "CS240 - Computer Science",
    semester: 4,
    yearOfStudy: 2,
    avatarUrl: undefined,
  },
  {
    id: "user-2",
    email: "sarah.wong@student.uitm.edu.my",
    name: "Sarah Wong Li Ying",
    contactNumber: "012-9876543",
    role: "STUDENT",
    studentId: "2023123457",
    program: "IT245 - Information Technology",
    semester: 6,
    yearOfStudy: 3,
    avatarUrl: undefined,
  },
  {
    id: "user-3",
    email: "john.tan@student.uitm.edu.my",
    name: "John Tan Wei Ming",
    contactNumber: "013-2468135",
    role: "STUDENT",
    studentId: "2024135791",
    program: "SE250 - Software Engineering",
    semester: 2,
    yearOfStudy: 1,
    avatarUrl: undefined,
  },
  {
    id: "staff-1",
    email: "abu.bakar@uitm.edu.my",
    name: "Officer Abu Bakar",
    contactNumber: "013-9876543",
    role: "STAFF",
    staffId: "S12345",
    department: "Campus Security",
    position: "Patrol Officer",
    avatarUrl: undefined,
  },
  {
    id: "staff-2",
    email: "siti.nurhaliza@uitm.edu.my",
    name: "Dr. Siti Nurhaliza",
    contactNumber: "012-5556789",
    role: "STAFF",
    staffId: "S12346",
    department: "Computer Science",
    position: "Senior Lecturer",
    avatarUrl: undefined,
  },
  {
    id: "admin-1",
    email: "rahman.admin@uitm.edu.my",
    name: "Encik Rahman Ibrahim",
    contactNumber: "019-3334567",
    role: "ADMIN",
    staffId: "A10001",
    department: "System Administration",
    position: "System Administrator",
    avatarUrl: undefined,
  },
];

type RoleFilter = "ALL" | "STUDENT" | "STAFF" | "ADMIN";

export default function AllUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [users] = useState<(Student | Staff)[]>(MOCK_ALL_USERS);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ("studentId" in user && user.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ("staffId" in user && user.staffId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "STAFF":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "ADMIN":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeactivate = (userId: string) => {
    // TODO: API call to deactivate user
    console.log("Deactivating user:", userId);
    alert("User deactivation functionality will be implemented with backend API");
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      // TODO: API call to delete user
      console.log("Deleting user:", userId);
      alert("User deletion functionality will be implemented with backend API");
    }
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
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">
            Manage all users in the system ({filteredUsers.length} users)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleFilter)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="STUDENT">Students</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="ADMIN">Administrators</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {"studentId" in user ? user.studentId : user.staffId}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {user.contactNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {"program" in user ? (
                      <div>
                        <div className="font-medium">{user.program}</div>
                        <div className="text-muted-foreground">
                          Sem {user.semester} • Year {user.yearOfStudy}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{user.department}</div>
                        <div className="text-muted-foreground">{user.position}</div>
                      </div>
                    )}
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
                          <UserCheck className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeactivate(user.id)}>
                          <UserX className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(user.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}