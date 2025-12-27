"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, ArrowLeft, Save, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Announcement } from "@/lib/types";
import { AnnouncementPhotoUpload } from "@/components/upload/announcement-photo-upload";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  message: z.string().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
  type: z.enum(["GENERAL", "EMERGENCY", "EVENT"]).refine(val => val, {
    message: "Type is required",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).refine(val => val, {
    message: "Priority is required",
  }),
  audience: z.enum(["ALL", "STUDENTS", "STAFF", "ADMIN"]).refine(val => val, {
    message: "Audience is required",
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function UpdateAnnouncementPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoPath, setPhotoPath] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "GENERAL",
      priority: "LOW",
      audience: "ALL",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/announcements/${params.id}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        console.log(data);
        setAnnouncement(data);

        reset({
          title: data.TITLE,
          message: data.MESSAGE,
          type: data.TYPE,
          priority: data.PRIORITY,
          audience: data.AUDIENCE,
          startDate: format(new Date(data.START_DATE), "yyyy-MM-dd"),
          endDate: format(new Date(data.END_DATE), "yyyy-MM-dd"),
        });
        
        setPhotoPath(data.PHOTO_PATH || "");
      } catch (error) {
        console.error('Error fetching announcement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [params.id, reset]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!announcement) {
    notFound();
  }

  const onSubmit = async (data: AnnouncementFormData, status: 'DRAFT' | 'PUBLISHED') => {
    const startDateIso = new Date(data.startDate).toISOString().slice(0, 10);
    const endDateIso = new Date(data.endDate).toISOString().slice(0, 10);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/announcements/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
          audience: data.audience,
          start_date: startDateIso,
          end_date: endDateIso,
          status: status,
          ...(photoPath && { photo_path: photoPath }),
        }),
      });
      if (!response.ok) throw new Error('Failed to update');
      router.push('/dashboard/announcement');
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Failed to update announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/announcement/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcement
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Update Announcement
        </h1>
        <p className="text-muted-foreground">
          Make changes to the announcement
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, 'PUBLISHED'))}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Announcement Details</CardTitle>
                <CardDescription>
                  Update the basic information for your announcement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter announcement title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Enter announcement message"
                    rows={8}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Provide detailed information about the announcement
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GENERAL">General</SelectItem>
                            <SelectItem value="EMERGENCY">Emergency</SelectItem>
                            <SelectItem value="EVENT">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.priority && (
                      <p className="text-sm text-destructive">{errors.priority.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo Upload</CardTitle>
                <CardDescription>
                  Update or remove the announcement photo (16:9 aspect ratio)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnnouncementPhotoUpload
                  currentPhotoUrl={photoPath}
                  onUploadComplete={(path) => setPhotoPath(path)}
                  onRemove={() => setPhotoPath("")}
                  disabled={isSubmitting}
                  announcementId={params.id}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
                <CardDescription>
                  Update when this announcement should be displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...register("startDate")}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...register("endDate")}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-destructive">{errors.endDate.message}</p>
                    )}
                  </div>
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
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience *</Label>
                  <Controller
                    name="audience"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="audience">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Users</SelectItem>
                          <SelectItem value="STUDENTS">Students Only</SelectItem>
                          <SelectItem value="STAFF">Staff Only</SelectItem>
                          <SelectItem value="ADMIN">Admins Only</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.audience && (
                    <p className="text-sm text-destructive">{errors.audience.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Update & Publish
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleSubmit((data) => onSubmit(data, 'DRAFT'))}
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
                  <Link href={`/dashboard/announcement/${params.id}`}>Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
