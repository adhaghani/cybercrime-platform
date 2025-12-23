"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const facilityReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title is too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description is too long"),
  location: z.string().min(5, "Location must be at least 5 characters").max(200, "Location is too long"),
  facilityType: z.enum(["ELECTRICAL", "PLUMBING", "FURNITURE", "INFRASTRUCTURE", "OTHER"] as const),
  severityLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const),
  affectedEquipment: z.string().max(500, "Equipment description is too long").optional().or(z.literal("")),
});

type FacilityReportFormValues = z.infer<typeof facilityReportSchema>;

export default function SubmitReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FacilityReportFormValues>({
    resolver: zodResolver(facilityReportSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      facilityType: "ELECTRICAL",
      severityLevel: "MEDIUM",
      affectedEquipment: "",
    },
  });

  const onSubmit = async (data: FacilityReportFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'FACILITY',
          title: data.title,
          description: data.description,
          location: data.location,
          facility_type: data.facilityType,
          severity_level: data.severityLevel,
          affected_equipment: data.affectedEquipment,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to submit report');
      
      toast.success("Report submitted successfully!");
      router.push("/dashboard/facility/my-reports");
    } catch (error) {
      console.error("Error submitting facility report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/facility">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Facility Report</h1>
          <p className="text-muted-foreground">
            Report a facility issue that needs attention.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>
                Provide detailed information about the facility issue.
              </CardDescription>
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

              <div className="grid gap-6 md:grid-cols-2">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Building, floor, room number" {...field} />
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
                        placeholder="Detailed description of the facility issue..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="affectedEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Equipment (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="List any equipment affected by this issue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel htmlFor="attachment">Attachment (Optional)</FormLabel>
                <div className="flex items-center gap-2">
                  <Input id="attachment" type="file" accept="image/*" />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormDescription>
                  Upload photos of the issue (max 5MB)
                </FormDescription>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
