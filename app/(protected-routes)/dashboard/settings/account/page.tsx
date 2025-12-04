"use client";

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
import {  Mail, Phone, Shield, BadgeCheck, GraduationCap, Briefcase, Building2, Calendar, Hash } from "lucide-react";

export default function AccountPage() {
  const { claims } = useAuth();
  const role = claims?.role;
  const metadata = claims?.user_metadata;

  // Common fields
  const user = {
    name: metadata?.name || "User",
    email: claims?.email || "user@example.com",
    role: role || "USER",
    avatarUrl: metadata?.avatarUrl || "",
    contactNumber: (metadata?.contactNumber as string) || "Not set",
  };

  // Student specific
  const studentInfo = role === 'STUDENT' ? {
    studentId: metadata?.studentId as string,
    program: metadata?.program as string,
    semester: metadata?.semester as number,
    yearOfStudy: metadata?.yearOfStudy as number,
  } : null;

  // Staff specific
  const staffInfo = (role === 'STAFF' || role === 'ADMIN' || role === 'SUPERADMIN') ? {
    staffId: metadata?.staffId as string,
    department: metadata?.department as string,
    position: metadata?.position as string,
  } : null;

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
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {user.role}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <div className="text-sm">{user.email}</div>
            </div>
            
            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                Contact Number
              </div>
              <div className="text-sm">{user.contactNumber}</div>
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
      </div>
    </div>
  );
}
