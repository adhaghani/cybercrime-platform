"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Pin, Search, Filter, Bell } from "lucide-react";
import { MOCK_ANNOUNCEMENTS } from "@/lib/api/mock-data";
import { AnnouncementType } from "@/lib/types";
import { format } from "date-fns";
import Image from "next/image";

export default function PublicAnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AnnouncementType | "ALL">("ALL");

  // Filter published announcements
  const publishedAnnouncements = MOCK_ANNOUNCEMENTS.filter(
    (a) => a.status === "PUBLISHED"
  );

  const filteredAnnouncements = publishedAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || announcement.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    // Pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "EVENT": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "GENERAL": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Latest news, updates, and safety alerts from the campus administration.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AnnouncementType | "ALL")}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="GENERAL">General</SelectItem>
            <SelectItem value="EMERGENCY">Emergency</SelectItem>
            <SelectItem value="EVENT">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={`flex flex-col hover:shadow-md transition-shadow ${announcement.isPinned ? 'border-primary/50 bg-primary/5' : ''}`}>
            {announcement.image_src && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
                <Image 
                  width={200}
                  height={100}
                  src={announcement.image_src} 
                  alt={announcement.title}
                  
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <Badge className={getTypeColor(announcement.type)} variant="outline">
                  {announcement.type}
                </Badge>
                {announcement.isPinned && (
                  <Badge variant="secondary" className="gap-1">
                    <Pin className="h-3 w-3" /> Pinned
                  </Badge>
                )}
              </div>
              <CardTitle className="line-clamp-2 mt-2">{announcement.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {format(new Date(announcement.createdAt), "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {announcement.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No announcements found</h3>
          <p>Check back later for updates.</p>
        </div>
      )}
    </div>
  );
}
