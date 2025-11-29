"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, FileText, ClipboardList, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CrimePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Reports</h1>
        <p className="text-muted-foreground">
          Report and track crime incidents on campus.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Submit New Report</CardTitle>
            <CardDescription>
              Report a crime incident such as theft, assault, vandalism, or harassment.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full">
              <Link href="/dashboard/crime/submit-report">Create Report</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>My Reports</CardTitle>
            <CardDescription>
              View and track the status of your submitted crime reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/crime/my-reports">View My Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>
              Browse all crime reports submitted across the campus.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/crime/reports">Browse All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          About Crime Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          Use this system to report any crime incidents on campus. For emergencies requiring immediate attention, 
          please call <strong>999</strong> or contact the UiTM Auxiliary Police directly. This reporting system 
          helps maintain campus safety and allows security personnel to track and investigate incidents effectively.
        </p>
      </div>
    </div>
  );
}
