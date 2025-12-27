"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, ClipboardList, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function FacilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facility Reports</h1>
        <p className="text-muted-foreground">
          Report and track facility issues on campus.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Submit New Report</CardTitle>
            <CardDescription>
              Report a new facility issue such as electrical, plumbing, or infrastructure problems.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full">
              <Link href="/dashboard/facility/submit-report">Create Report</Link>
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
              Browse all facility reports submitted across the campus.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/facility/reports">Browse All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          About Facility Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          Use this system to report any facility-related issues on campus, including electrical problems, 
          plumbing leaks, damaged furniture, or infrastructure concerns. Our maintenance team will 
          review and address your reports promptly.
        </p>
      </div>
    </div>
  );
}
