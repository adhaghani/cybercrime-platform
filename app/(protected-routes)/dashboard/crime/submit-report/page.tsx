"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/context/auth-provider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ReportEvidenceUpload } from "@/components/upload/report-evidence-upload";
import { generateMetadata } from "@/lib/seo";
const crimeReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title is too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description is too long"),
  location: z.string().min(5, "Location must be at least 5 characters").max(200, "Location is too long"),
  crimeCategory: z.enum(["THEFT", "ASSAULT", "VANDALISM", "HARASSMENT", "OTHER"] as const),
  suspectDescription: z.string().max(1000, "Suspect description is too long").optional().or(z.literal("")),
  victimInvolved: z.string().max(1000, "Victim information is too long").optional().or(z.literal("")),
  weaponInvolved: z.string().max(500, "Weapon description is too long").optional().or(z.literal("")),
  injuryLevel: z.enum(["NONE", "MINOR", "MODERATE", "SEVERE"] as const).optional().or(z.literal("")),
  evidenceDetails: z.string().max(1000, "Evidence details are too long").optional().or(z.literal("")),
});

type CrimeReportFormValues = z.infer<typeof crimeReportSchema>;

export default function SubmitCrimeReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);
  const [hasDetails, setHasDetails] = useState(false);
  const {claims} = useAuth();
  const AccountID = claims?.ACCOUNT_ID;

  const form = useForm<CrimeReportFormValues>({
    resolver: zodResolver(crimeReportSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      crimeCategory: "THEFT",
      suspectDescription: "",
      victimInvolved: "",
      weaponInvolved: "",
      injuryLevel: "",
      evidenceDetails: "",
    },
  });

  generateMetadata({
    title: "Submit Crime Report - Cybercrime Reporting Platform",
    description: "Report a crime incident that occurred on campus using the Cybercrime Reporting Platform.",
    canonical: "/dashboard/crime/submit-report",
  });

  const onSubmit = async (data: CrimeReportFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          REPORT_TYPE: 'CRIME',
          TITLE: data.title,
          DESCRIPTION: data.description,
          LOCATION: data.location,
          INCIDENT_DATE: new Date().toISOString(),
          SUBMITTER_ID: AccountID,
          STATUS: 'PENDING',
          TYPE: 'CRIME',
          CRIME_CATEGORY: data.crimeCategory,
          SUSPECT_DESCRIPTION: data.suspectDescription || null,
          VICTIM_INVOLVED: data.victimInvolved || null,
          WEAPON_INVOLVED: data.weaponInvolved || null,
          INJURY_LEVEL: data.injuryLevel === "" ? null : data.injuryLevel,
          EVIDENCE_DETAILS: data.evidenceDetails || null,
          EVIDENCE_PATH: evidenceImages.length > 0 ? JSON.stringify(evidenceImages) : null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }
      
      toast.success("Crime report submitted successfully!");
      router.push("/dashboard/crime/my-reports");
    } catch (error) {
      console.error("Error submitting crime report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/crime">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Crime Report</h1>
          <p className="text-muted-foreground">
            Report a crime incident that occurred on campus.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>
                Provide detailed information about the crime incident. For emergencies, call 999.
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
                      <Input placeholder="Brief description of the incident" {...field} />
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
                        <SelectTrigger className="w-full">
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

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Where did the incident occur?" {...field} />
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
                        placeholder="Detailed description of what happened..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Evidence Photos</FormLabel>
                <ReportEvidenceUpload
                  onUploadComplete={(paths) => setEvidenceImages(paths)}
                  maxImages={5}
                  disabled={isSubmitting}
                />
                <FormDescription>
                  Upload up to 5 photos as evidence (max 10MB each)
                </FormDescription>
              </div>
            </CardContent>
          </Card>
          <div>
          <Switch checked={hasDetails} onCheckedChange={setHasDetails}  />
          <span className="ml-2 font-medium">Add Additional Details (Optional)</span>
          </div>
          {hasDetails && <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Provide any additional information that may help in the investigation.
              </CardDescription>
            </CardHeader>
<CardContent className="space-y-6">

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="suspectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suspect Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Physical appearance, clothing, etc."
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
                      <FormLabel>Victim Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Who was affected by this incident?"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="weaponInvolved"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weapon Involved</FormLabel>
                      <FormControl>
                        <Input placeholder="Description of any weapons used" {...field} />
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select injury level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="MINOR">Minor</SelectItem>
                          <SelectItem value="MODERATE">Moderate</SelectItem>
                          <SelectItem value="SEVERE">Severe</SelectItem>
                        </SelectContent>
                      </Select>
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
                        placeholder="Description of any evidence (photos, videos, witnesses, etc.)"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

</CardContent>
          </Card>}
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
