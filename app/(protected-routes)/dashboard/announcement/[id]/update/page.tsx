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
import { Bell, ArrowLeft, Save, Send, Upload, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { MOCK_ANNOUNCEMENTS } from "@/lib/api/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function UpdateAnnouncementPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const announcement = MOCK_ANNOUNCEMENTS.find((a) => a.id === params.id);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [audience, setAudience] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setMessage(announcement.message);
      setImagePreview(announcement.image_src || null);
      setType(announcement.type);
      setPriority(announcement.priority);
      setAudience(announcement.audience);
      setIsPinned(announcement.isPinned || false);
      setStartDate(new Date(announcement.startDate));
      setEndDate(new Date(announcement.endDate));
    }
  }, [announcement]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  if (!announcement) {
    notFound();
  }

  const handleSubmit = (e: React.FormEvent, status: 'DRAFT' | 'PUBLISHED') => {
    e.preventDefault();
    // TODO: Implement API call to update announcement
    console.log('Updating announcement with status:', status);
    router.push('/dashboard/announcement');
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

      <form onSubmit={(e) => handleSubmit(e, 'PUBLISHED')}>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter announcement message"
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide detailed information about the announcement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Announcement Image (Optional)</Label>
                  
                  {!imagePreview ? (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                      <Image
                                              width={200}
                        height={100}
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select value={type} onValueChange={setType} required>
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
                    <Select value={priority} onValueChange={setPriority} required>
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
                  <Select value={audience} onValueChange={setAudience} required>
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
                  Update & Publish
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'DRAFT')}
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
