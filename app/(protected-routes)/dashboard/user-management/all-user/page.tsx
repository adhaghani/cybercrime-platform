"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInitials, getRoleBadgeColor } from "@/lib/utils/badge-helpers";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, Search, Filter, Mail, Phone, 
  UserCheck, Trash2 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import {  Student, Staff } from "@/lib/types";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";
import { ViewUserDetailDialog } from "@/components/users/viewUserDetailDialog";

const ITEMS_PER_PAGE = 10;

type RoleFilter = "ALL" | "STUDENT" | "STAFF";

export default function AllUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<(Student | Staff)[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/accounts');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.EMAIL.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ("STUDENT_ID" in user && user.STUDENT_ID.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ("STAFF_ID" in user && user.STAFF_ID.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || ("ROLE" in user && user.ROLE === roleFilter) || user.ACCOUNT_TYPE === "STUDENT";

    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const handleViewDetails = (accountId: string) => {
    setSelectedUserId(accountId);
    setOpenViewDialog(true);
  };

  const handleDeleteUser = (accountId: string, userName: string, userEmail: string) => {
    setSelectedUserId(accountId);
    setSelectedUserName(userName);
    setSelectedUserEmail(userEmail);
    setOpenDeleteDialog(true);
  };

  const handleRefreshUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        <Select value={roleFilter} onValueChange={(v) => handleFilterChange(() => setRoleFilter(v as RoleFilter))}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="STUDENT">Students</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.ACCOUNT_ID}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.AVATAR_URL} />
                        <AvatarFallback
                        className={user.ACCOUNT_TYPE === "STUDENT" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"}
                        >{getInitials(user.NAME)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.NAME}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.EMAIL}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {"STUDENT_ID" in user ? user.STUDENT_ID : user.STAFF_ID}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor("ROLE" in user ? user.ROLE : user.ACCOUNT_TYPE)}>
                      {"ROLE" in user ? user.ROLE : user.ACCOUNT_TYPE}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {user.CONTACT_NUMBER}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Button variant="outline" size="icon-sm" onClick={() => handleViewDetails(user.ACCOUNT_ID)}>
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      View Details
                    </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="bg-red-500/10 text-red-500 border-red-500 hover:bg-red-500/20 hover:text-red-500"
                      onClick={() => handleDeleteUser(user.ACCOUNT_ID, user.NAME, user.EMAIL)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Delete User
                    </TooltipContent>
                    </Tooltip>
                    </div>
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
          {paginatedUsers.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredUsers.length}
            />
          )}
      {/* Dialogs */}
      <ViewUserDetailDialog
        accountId={selectedUserId}
        open={openViewDialog}
        onOpenChange={setOpenViewDialog}
      />
      
      <DeleteUserDialog
        accountId={selectedUserId}
        userName={selectedUserName}
        userEmail={selectedUserEmail}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={handleRefreshUsers}
      />
    </div>
  );
}