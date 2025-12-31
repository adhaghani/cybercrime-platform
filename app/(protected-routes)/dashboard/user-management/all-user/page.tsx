"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
} from "lucide-react";
import Link from "next/link";
import {  Student, Staff } from "@/lib/types";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";
import { ViewUserDetailDialog } from "@/components/users/viewUserDetailDialog";
import { useAuth } from "@/lib/context/auth-provider";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/all-user/columns";




export default function AllUsersPage() {

  const [users, setUsers] = useState<(Student | Staff)[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const {claims} = useAuth();
  const ACCOUNT_ID = claims?.ACCOUNT_ID || null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/accounts');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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

  const columns = useMemo(
    () => createColumns({
      onViewDetails: handleViewDetails,
      onDelete: handleDeleteUser,
      isAdmin: claims?.ROLE === "ADMIN" || claims?.ROLE === "SUPERADMIN",
      currentAccountId: ACCOUNT_ID,
    }),
    [claims, ACCOUNT_ID]
  );
  
  const filterableColumns = [
    {
      id: "ACCOUNT_TYPE",
      title: "Role",
      options: [
        { label: "STUDENT", value: "STUDENT" },
        { label: "STAFF", value: "STAFF" },
      ],
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
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">
            Manage all users in the system ({users.length} users)
          </p>
        </div>
      </div>
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle> 
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={users}
            searchKey="NAME"
            searchPlaceholder="Search by name, email, or ID..."
            filterableColumns={filterableColumns}
          />
          {users.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>

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