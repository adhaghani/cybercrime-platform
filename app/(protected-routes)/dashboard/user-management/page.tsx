"use client";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader,CardContent, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Mock statistics - replace with actual API calls
// const USER_STATS = {
//   totalUsers: 1247,
//   students: 1050,
//   staff: 175,
//   administrators: 22,
// };

interface AccountCount {
  totalAccounts: number;
  staffCount: number;
  studentCount: number;
}

export default function UserManagementPage() {
  const [accountCount, setAccountCount] = useState<AccountCount | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  const fetchAccountCount = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/accounts/count");
      if (response.ok) {
        const data = await response.json();
        setAccountCount({
          totalAccounts: data.totalAccounts,
          staffCount: data.staffCount,
          studentCount: data.studentCount,
        });
        setLoading(false);
      } else {
        console.error('Failed to fetch account count:', response.statusText);
      }
      
    } catch(error){
      console.error('Error fetching account:', error);
    }
  }

  useEffect(() => {
    fetchAccountCount();
  }, []);

     if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <div className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full rounded-md"/>
            <Skeleton className="h-24 w-full rounded-md"/>
            <Skeleton className="h-24 w-full rounded-md"/>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-md"/>
            <Skeleton className="h-32 w-full rounded-md"/>
            <Skeleton className="h-32 w-full rounded-md"/>
            <Skeleton className="h-32 w-full rounded-md"/>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage all users, students, staff, and administrators in the system
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountCount?.totalAccounts}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountCount?.studentCount}</div>
            <p className="text-xs text-muted-foreground">Active student accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountCount?.staffCount}</div>
            <p className="text-xs text-muted-foreground">Staff members</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/dashboard/user-management/all-user">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">All Users</CardTitle>
              <CardDescription>
                View and manage all users in the system
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/dashboard/user-management/students">
            <CardHeader>
              <div className="flex items-center justify-between">
                <GraduationCap className="h-8 w-8 text-blue-500" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Students</CardTitle>
              <CardDescription>
                Manage student accounts and profiles
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/dashboard/user-management/staff">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Briefcase className="h-8 w-8 text-green-500" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Staff</CardTitle>
              <CardDescription>
                Manage staff members and permissions
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/dashboard/user-management/administrator">
            <CardHeader>
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-8 w-8 text-purple-500" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Administrators</CardTitle>
              <CardDescription>
                Manage system administrators
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}