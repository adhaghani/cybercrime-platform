"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {  Mail, Phone, Shield, BadgeCheck, GraduationCap, Briefcase, Building2, Calendar, Hash, AlertTriangle } from "lucide-react";
import { DeleteUserDialog } from "@/components/users/deleteUserDialog";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { claims } = useAuth();
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const role = claims?.ROLE || "STUDENT";
  const ACCOUNT_TYPE = claims?.ACCOUNT_TYPE;
  console.log(claims);
  // Common fields
  const user = {
    NAME: claims?.NAME || "User",
    EMAIL: claims?.EMAIL || "user@example.com",
    ROLE: role || "STUDENT",
    AVATAR_URL: claims?.AVATAR_URL || "",
    CONTACT_NUMBER: (claims?.CONTACT_NUMBER as string) || "Not set",
  };

  // Student specific
  const studentInfo = ACCOUNT_TYPE === 'STUDENT' ? {
    studentId: claims?.STUDENT_ID as string,
    program: claims?.PROGRAM as string,
    semester: claims?.SEMESTER as number,
    yearOfStudy: claims?.YEAR_OF_STUDY as number,
  } : null;

  // Staff specific
  const staffInfo = ACCOUNT_TYPE === 'STAFF' ? {
    staffId: claims?.STAFF_ID as string,
    department: claims?.DEPARTMENT as string,
    position: claims?.POSITION as string,
  } : null;

  const handleDeleteSuccess = () => {
    // After successful deletion, redirect to login
    router.push('/auth/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your account details.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.AVATAR_URL} alt={user.NAME} />
              <AvatarFallback className="text-lg">
                {user.NAME
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl">{user.NAME}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {user.ROLE}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <div className="text-sm">{user.EMAIL}</div>
            </div>
            
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                Contact Number
              </div>
              <div className="text-sm">{user.CONTACT_NUMBER}</div>
            </div>

            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BadgeCheck className="h-4 w-4" />
                Account Status
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm">Active</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/settings/account/edit">Edit Profile</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Student Information */}
        {studentInfo && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Student ID
                </div>
                <div className="text-sm">{studentInfo.studentId}</div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  Program
                </div>
                <div className="text-sm">{studentInfo.program}</div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Semester
                </div>
                <div className="text-sm">{studentInfo.semester}</div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Year of Study
                </div>
                <div className="text-sm">{studentInfo.yearOfStudy}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Staff Information */}
        {staffInfo && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Staff ID
                </div>
                <div className="text-sm">{staffInfo.staffId}</div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Department
                </div>
                <div className="text-sm">{staffInfo.department}</div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  Position
                </div>
                <div className="text-sm">{staffInfo.position}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="md:col-span-2 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between rounded-lg border border-destructive/50 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setOpenDeleteDialog(true)}
                className="ml-4 shrink-0"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Dialog */}
      <DeleteUserDialog
        accountId={claims?.ACCOUNT_ID as string || null}
        userName={user.NAME}
        userEmail={user.EMAIL}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
