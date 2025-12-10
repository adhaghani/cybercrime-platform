"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MOCK_REPORTS } from "@/lib/api/mock-data";
import { CrimeReport} from "@/lib/types";

const crimeReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
  location: z.string().min(3, "Location must be at least 3 characters").max(100, "Location is too long"),
  crimeCategory: z.enum(["THEFT", "ASSAULT", "VANDALISM", "HARASSMENT", "OTHER"] as const),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"] as const),
  suspectDescription: z.string().max(500, "Description is too long").optional(),
  victimInvolved: z.string().max(200, "Name is too long").optional(),
  weaponInvolved: z.string().max(200, "Description is too long").optional(),
  injuryLevel: z.string().max(200, "Description is too long").optional(),
  evidenceDetails: z.string().max(500, "Details are too long").optional(),
});

type CrimeReportFormValues = z.infer<typeof crimeReportSchema>;

export default function UpdateCrimeReportPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<CrimeReport | null>(null);

  const form = useForm<CrimeReportFormValues>({
    resolver: zodResolver(crimeReportSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      crimeCategory: "THEFT",
      status: "PENDING",
      suspectDescription: "",
      victimInvolved: "",
      weaponInvolved: "",
      injuryLevel: "",
      evidenceDetails: "",
    },
  });

  useEffect(() => {
    // Fetch report data - replace with actual API call
    const foundReport = MOCK_REPORTS.find(
      (r) => r.id === params.id && r.type === "CRIME"
    ) as CrimeReport;

    if (foundReport) {
      setReport(foundReport);
      form.reset({
        title: foundReport.title,
        description: foundReport.description,
        location: foundReport.location,
        crimeCategory: foundReport.crimeCategory,
        status: foundReport.status,
        suspectDescription: foundReport.suspectDescription || "",
        victimInvolved: foundReport.victimInvolved || "",
        weaponInvolved: foundReport.weaponInvolved || "",
        injuryLevel: foundReport.injuryLevel || "",
        evidenceDetails: foundReport.evidenceDetails || "",
      });
    }
  }, [params.id, form]);

  const onSubmit = async (data: CrimeReportFormValues) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Updating crime report:", { id: params.id, ...data });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push(`/dashboard/crime/reports/${params.id}`);
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
          <Link href={`/dashboard/crime/reports/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Crime Report</h1>
          <p className="text-muted-foreground">
            Modify the crime report details and status
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
              <CardDescription>Update the basic details of the crime report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the crime" {...field} />
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
                        placeholder="Provide detailed information about the incident..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include what happened, when, and any other relevant details
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
                        <Input placeholder="e.g., Library, Block A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="crimeCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crime Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="THEFT">Theft</SelectItem>
                          <SelectItem value="ASSAULT">Assault</SelectItem>
                          <SelectItem value="VANDALISM">Vandalism</SelectItem>
                          <SelectItem value="HARASSMENT">Harassment</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Optional information about the incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="suspectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suspect Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Physical description, clothing, distinguishing features..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="victimInvolved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Victim Involved</FormLabel>
                    <FormControl>
                      <Input placeholder="Name or description of victim(s)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="weaponInvolved"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weapon Involved</FormLabel>
                      <FormControl>
                        <Input placeholder="Type of weapon, if any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="injuryLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Level</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., None, Minor, Severe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="evidenceDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evidence Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description of any evidence (photos, videos, documents)..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
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