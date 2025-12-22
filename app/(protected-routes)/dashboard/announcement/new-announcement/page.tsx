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
import { Switch } from "@/components/ui/switch";
import { Bell, ArrowLeft, Save, Send, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [isPinned, setIsPinned] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
  };

  const handleSubmit = (e: React.FormEvent, status: 'DRAFT' | 'PUBLISHED') => {
    e.preventDefault();
    // TODO: Implement API call to create announcement
    console.log('Creating announcement with status:', status);
    router.push('/dashboard/announcement');
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

      <form className="" onSubmit={(e) => handleSubmit(e, 'PUBLISHED')}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Announcement Details</CardTitle>
                <CardDescription>
                  Provide the basic information for your announcement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter announcement message"
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide detailed information about the announcement
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select required>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select required>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo Upload</CardTitle>
                <CardDescription>
                  Add an optional photo to your announcement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo">Announcement Photo (Optional)</Label>
                  {photoPreview ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video w-full bg-accent rounded-lg overflow-hidden">
                        <Image
                        width={200}
                        height={100} 
                          src={photoPreview} 
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemovePhoto}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="photo"
                        className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer bg-accent/50 hover:bg-accent transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or WEBP (MAX. 5MB)
                          </p>
                        </div>
                        <Input
                          id="photo"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    </div>
                  )}
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
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      required
                      value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                    />
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
                  <Select required>
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
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pinned">Pin Announcement</Label>
                    <p className="text-sm text-muted-foreground">
                      Display at the top of dashboard
                    </p>
                  </div>
                  <Switch
                    id="pinned"
                    checked={isPinned}
                    onCheckedChange={setIsPinned}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Publish Announcement
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleSubmit(e as React.FormEvent, 'DRAFT')}
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
    </div>
  );
}
