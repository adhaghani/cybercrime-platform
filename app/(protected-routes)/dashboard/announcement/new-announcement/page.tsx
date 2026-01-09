"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { AnnouncementPhotoUpload } from "@/components/upload/announcement-photo-upload";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/context/auth-provider";
import { generateMetadata } from "@/lib/seo";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  message: z.string().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
  type: z.enum(["GENERAL", "EMERGENCY", "EVENT"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  targetAudience: z.enum(["ALL", "STUDENTS", "STAFF", "ADMIN"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  photo: z.any().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [photoPath, setPhotoPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { claims } = useAuth();
  const ACCOUNT_ID = claims?.ACCOUNT_ID || null;

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      type: undefined,
      priority: undefined,
      targetAudience: undefined,
      startDate: "",
      endDate: "",
    },
  });

  generateMetadata({
    title: "Create Announcement - Cybercrime Reporting Platform",
    description: "Create a new announcement to notify users about important updates.",
    canonical: "/dashboard/announcement/new",
  });

  const onSubmit = async (data: z.infer<typeof announcementSchema>, status: 'DRAFT' | 'PUBLISHED') => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
          audience: data.targetAudience,
          start_date: data.startDate,
          end_date: data.endDate,
          created_by: ACCOUNT_ID,
          status,
          ...(photoPath && { photo_path: photoPath }),
        }),
      });
      if (!response.ok) throw new Error('Failed to create announcement');
      toast.success('Announcement created successfully');
      router.push('/dashboard/announcement');
    } catch (error) {
      console.error('Failed to create announcement:', error);
      toast.error('Failed to create announcement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/announcement">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Create New Announcement
        </h1>
        <p className="text-muted-foreground">
          Create a new announcement to notify users about important updates
        </p>
      </div>

      <Form {...form}>
        <form className="">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4">

            <Card>
              <CardHeader>
                <CardTitle>Photo Upload</CardTitle>
                <CardDescription>
                  Add an optional photo to your announcement (16:9 aspect ratio)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnnouncementPhotoUpload
                  currentPhotoUrl={photoPath}
                  onUploadComplete={(path) => {console.log(path); setPhotoPath(path)}}
                  onRemove={() => setPhotoPath("")}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Announcement Details</CardTitle>
                  <CardDescription>
                    Provide the basic information for your announcement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter announcement title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter announcement message"
                            rows={8}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide detailed information about the announcement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="GENERAL">General</SelectItem>
                              <SelectItem value="EMERGENCY">Emergency</SelectItem>
                              <SelectItem value="EVENT">Event</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
                <CardDescription>
                  Set when this announcement should be displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure announcement settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALL">All Users</SelectItem>
                          <SelectItem value="STUDENTS">Students Only</SelectItem>
                          <SelectItem value="STAFF">Staff Only</SelectItem>
                          <SelectItem value="ADMIN">Admins Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  type="button"
                  className="w-full"
                  disabled={isLoading}
                  onClick={form.handleSubmit((data) => onSubmit(data, 'PUBLISHED'))}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Publishing..." : "Publish Announcement"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                  onClick={form.handleSubmit((data) => onSubmit(data, 'DRAFT'))}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  asChild
                >
                  <Link href="/dashboard/announcement">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
    </div>
  );
}
