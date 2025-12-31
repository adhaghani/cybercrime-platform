"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Staff } from "@/lib/types";
import {Skeleton} from "@/components/ui/skeleton";
import { ViewUserDetailDialog } from "@/components/users/viewUserDetailDialog";
import { DemoteAdminDialog } from "@/components/users/demoteAdminDialog";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { useAuth } from "@/lib/context/auth-provider";
import { 
  ArrowLeft,
  ShieldCheck,
  UsersIcon
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ViewStaffAssignmentDialog } from "@/components/users/viewStaffAssignmentDialog";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "@/components/administrator/columns";



export default function AdministratorPage() {

  const [administrators, setAdministrators] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [OpenStaffAssignmentDIalog, setOpenStaffAssignmentDIalog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDemoteDialog, setOpenDemoteDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [selectedAdminName, setSelectedAdminName] = useState<string>("");
  const [selectedAdminEmail, setSelectedAdminEmail] = useState<string>("");
  const [selectedAdminRole, setSelectedAdminRole] = useState<string>("");

  const { claims } = useAuth();
  const ACCOUNT_ID = claims?.ACCOUNT_ID || null;
  const hasAnyRole = useHasAnyRole();
  const isAdmin = hasAnyRole([ 'ADMIN', 'SUPERADMIN']);
  useEffect(() => {
    const fetchAdministrators = async () => {
      try {
        const response = await fetch('/api/staff?role=ADMIN');
        if (!response.ok) throw new Error('Failed to fetch administrators');
        const data = await response.json();
        setAdministrators(data.staff);
      } catch (error) {
        console.error('Error fetching administrators:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdministrators();
  }, []);


    // Get unique departments for filter
  const departments = Array.from(new Set(administrators.map(s => s.DEPARTMENT)));



  const handleViewDetails = (accountId: string) => {
    setSelectedAdminId(accountId);
    setOpenViewDialog(true);
  };

  const handleRevokeAdmin = (accountId: string, name: string, role: string) => {
    setSelectedAdminId(accountId);
    setSelectedAdminName(name);
    setSelectedAdminRole(role);
    setOpenDemoteDialog(true);
  };

  const handleDeleteAccount = (accountId: string, name: string, email: string) => {
    setSelectedAdminId(accountId);
    setSelectedAdminName(name);
    setSelectedAdminEmail(email);
    setOpenDeleteDialog(true);
  };

  const handleRefreshAdministrators = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/staff?role=ADMIN');
      if (!response.ok) throw new Error('Failed to fetch administrators');
      const data = await response.json();
      setAdministrators(data.staff);
    } catch (error) {
      console.error('Error fetching administrators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterableColumns = [
    {
      id: "DEPARTMENT",
      title: "Department",
      options: departments.map(dept => ({ label: dept, value: dept })),
    },
  ]

    const columns = useMemo(() => createColumns({
    onViewDetails: handleViewDetails,
    onDemote: handleRevokeAdmin,
    onDelete: handleDeleteAccount,
    isAdmin: isAdmin,
    currentAccountId: ACCOUNT_ID,
  }), [isAdmin, ACCOUNT_ID]);


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
              Manage system administrators and their privileges ({administrators.length} administrators)
            </p>
          </div>
        </div>
      </div>

      {/* Administrators Table */}
      {administrators.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Administrators ({administrators.length})</CardTitle>
          </CardHeader>
          <CardContent>
        <DataTable 
          columns={columns}
          data={administrators}
          searchKey="NAME"
          searchPlaceholder="Search by name, email, staff ID, department, or position..."
          filterableColumns={filterableColumns}
        />
        </CardContent>
        </Card>
      ) : (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon />
        </EmptyMedia>
        <EmptyTitle>No Administrator Yet</EmptyTitle>
        <EmptyDescription>
          The system currently has no administrators. Administrators have elevated privileges to manage users and system settings.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {isAdmin &&<div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/user-management/staff/add">Add Admin</Link>
            </Button>
        </div>}
      </EmptyContent>
    </Empty>
      )}

      {/* Dialogs */}
      <ViewUserDetailDialog
        accountId={selectedAdminId}
        open={openViewDialog}
        onOpenChange={setOpenViewDialog}
      />

      <DemoteAdminDialog
        accountId={selectedAdminId}
        adminName={selectedAdminName}
        currentRole={selectedAdminRole}
        open={openDemoteDialog}
        onOpenChange={setOpenDemoteDialog}
        onSuccess={handleRefreshAdministrators}
      />

      <DeleteUserDialog
        accountId={selectedAdminId}
        userName={selectedAdminName}
        userEmail={selectedAdminEmail}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={handleRefreshAdministrators}
      />

      <ViewStaffAssignmentDialog
        accountId={selectedAdminId}
        staffName={selectedAdminName}
        open={OpenStaffAssignmentDIalog}
        onOpenChange={setOpenStaffAssignmentDIalog}
      />
    </div>
  );
}