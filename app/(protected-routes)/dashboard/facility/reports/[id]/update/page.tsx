"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { FacilityReport } from "@/lib/types";

const facilityReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
  location: z.string().min(3, "Location must be at least 3 characters").max(100, "Location is too long"),
  facilityType: z.enum(["ELECTRICAL", "PLUMBING", "FURNITURE", "INFRASTRUCTURE", "OTHER"] as const),
  severityLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"] as const),
  affectedEquipment: z.string().max(200, "Description is too long").optional(),
});

type FacilityReportFormValues = z.infer<typeof facilityReportSchema>;

export default function UpdateFacilityReportPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<FacilityReport | null>(null);

  const form = useForm<FacilityReportFormValues>({
    resolver: zodResolver(facilityReportSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      facilityType: "ELECTRICAL",
      severityLevel: "MEDIUM",
      status: "PENDING",
      affectedEquipment: "",
    },
  });

  useEffect(() => {
    // Fetch report data - replace with actual API call
    const foundReport = MOCK_REPORTS.find(
      (r) => r.id === params.id && r.type === "FACILITY"
    ) as FacilityReport;

    if (foundReport) {
      setReport(foundReport);
      form.reset({
        title: foundReport.title,
        description: foundReport.description,
        location: foundReport.location,
        facilityType: foundReport.facilityType,
        severityLevel: foundReport.severityLevel,
        status: foundReport.status,
        affectedEquipment: foundReport.affectedEquipment || "",
      });
    }
  }, [params.id, form]);

  const onSubmit = async (data: FacilityReportFormValues) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Updating facility report:", { id: params.id, ...data });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push(`/dashboard/facility/reports/${params.id}`);
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/facility/reports/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Facility Report</h1>
          <p className="text-muted-foreground">
            Modify the facility report details and status
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
              <CardDescription>Update the basic details of the facility report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the issue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed information about the facility issue..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include what is broken, when it was noticed, and any safety concerns
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Building A, Room 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facilityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                          <SelectItem value="PLUMBING">Plumbing</SelectItem>
                          <SelectItem value="FURNITURE">Furniture</SelectItem>
                          <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="severityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity Level *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How urgent is this issue?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Update the current status of this report
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="affectedEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Equipment</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Air conditioner unit, Light fixture #3" {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify equipment or items that are affected (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Report
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}