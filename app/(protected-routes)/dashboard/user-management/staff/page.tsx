"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Briefcase, 
  UserPlus,
  Download
} from "lucide-react";
import Link from "next/link";
import { Staff } from "@/lib/types";
import { ViewUserDetailDialog } from "@/components/users/viewUserDetailDialog";
import { ViewStaffAssignmentDialog } from "@/components/users/viewStaffAssignmentDialog";
import { PromoteStaffDialog } from "@/components/users/promoteStaffDialog";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";
import { useAuth } from "@/lib/context/auth-provider";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/staff/columns";

export default function StaffManagementPage() {
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
  // Create columns with handlers
  const columns = useMemo(
    () => createColumns({
      onViewDetails: (accountId: string) => {
        setSelectedStaffId(accountId);
        setOpenViewDialog(true);
      },
      onViewAssignments: (accountId: string, name: string) => {
        setSelectedStaffId(accountId);
        setSelectedStaffName(name);
        setOpenAssignmentsDialog(true);
      },
      onPromote: (accountId: string, name: string) => {
        setSelectedStaffId(accountId);
        setSelectedStaffName(name);
        setOpenPromoteDialog(true);
      },
      onDelete: (accountId: string, name: string, email: string) => {
        setSelectedStaffId(accountId);
        setSelectedStaffName(name);
        setSelectedStaffEmail(email);
        setOpenDeleteDialog(true);
      },
      isAdmin,
      currentAccountId: ACCOUNT_ID,
    }),
    [isAdmin, ACCOUNT_ID]
  );

  // Prepare filterable columns
  const filterableColumns = [
    {
      id: "DEPARTMENT",
      title: "Department",
      options: departments.map(dept => ({ label: dept, value: dept })),
    },
  ];

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
            Manage staff accounts and department information ({staffMembers.length} staff members)
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

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <p>Staff List ({staffMembers.length})</p>
            {isAdmin && <Button onClick={handleDownloadCSV} variant={"secondary"}>
              <Download className="h-4 w-4 mr-2" />
              Download as CSV</Button>}
            </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={staffMembers}
            searchKey="NAME"
            searchPlaceholder="Search by name, email, staff ID, department, or position..."
            filterableColumns={filterableColumns}
          />
        </CardContent>
      </Card>

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