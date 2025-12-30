"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MapPin, Search, Siren, Flame, Stethoscope, ShieldAlert, Pencil } from "lucide-react";
import { useHasAnyRole } from "@/hooks/use-user-role";
import Link from "next/link";
import { EmergencyInfo } from "@/lib/types";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip"
import { generateMetadata } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 9;


export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const hasAnyRole = useHasAnyRole();

  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      try {
        const response = await fetch('/api/emergency');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching emergency contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmergencyContacts();
  }, []);

  const isAuthorizedForEdit = () => {
    if(hasAnyRole(['ADMIN', 'SUPERADMIN', 'STAFF'])) return true;
    return false;
  };

  console.log(contacts)

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = 
      (contact.NAME?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (contact.STATE?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (contact.ADDRESS?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesType = activeTab === "all" || (contact.TYPE?.toLowerCase().replace(" ", "-") === activeTab);
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

   if (loading) {
    return (
      <>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
      </>
    );
  }

  const getIcon = (type: string | null | undefined) => {
    if (!type) return <Phone className="h-5 w-5" />;
    
    switch (type) {
      case "Police": return <Siren className="h-5 w-5 text-blue-600" />;
      case "Fire": return <Flame className="h-5 w-5 text-orange-600" />;
      case "Medical": return <Stethoscope className="h-5 w-5 text-red-600" />;
      case "Civil Defence": return <ShieldAlert className="h-5 w-5 text-green-600" />;
      default: return <Phone className="h-5 w-5" />;
    }
  };

  generateMetadata({
    title: "Emergency Contacts - Cybercrime Reporting Platform",
    description: "Directory of Police, Fire, Hospital, and Civil Defence services across Malaysia.",
    canonical: "/dashboard/emergency-services/emergency-contacts",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">National Emergency Contacts</h1>
        <p className="text-muted-foreground">
          Directory of Police, Fire, Hospital, and Civil Defence services across Malaysia.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, state, or address..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => handleFilterChange(() => setActiveTab(v))} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="police">Police</TabsTrigger>
          <TabsTrigger value="fire">Fire</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="civil-defence" className="whitespace-normal text-center">Civil Defence</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedContacts.map((contact) => (
          <Card key={contact.EMERGENCY_ID} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold leading-tight">{contact.NAME || 'Unknown'}</CardTitle>
                  {getIcon(contact.TYPE || "")}
              </div>
              <CardDescription className="font-medium text-primary">{contact.TYPE || 'Unknown'} • {contact.STATE || 'Unknown'}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                <span>{contact.ADDRESS || 'No address available'}</span>
              </div>
              
              <div className="mt-auto flex gap-2 justify-between w-full items-center pt-4">

                  {contact.PHONE && (
                    <Button variant="secondary" asChild>
                        <a href={`tel:${contact.PHONE.replace(/\s/g, '')}`}>
                            Office: {contact.PHONE}
                        </a>
                    </Button>
                  )}
                  {isAuthorizedForEdit() ? 
                  <Tooltip>
                    <TooltipTrigger asChild>
                  <Button variant={"outline"} size="icon-sm" asChild>
                  <Link  href={`/dashboard/emergency-services/emergency-contacts/${contact.EMERGENCY_ID}/update`}>
                 <Pencil size={10} /> 
                 </Link>
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Edit
                </TooltipContent>
                </Tooltip> : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && filteredContacts.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredContacts.length}
        />
      )}
      {
        contacts.length === 0 && (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Flame />
        </EmptyMedia>
        <EmptyTitle>No Emergency Contacts Data Yet</EmptyTitle>
        <EmptyDescription>
          The system currently has no records of Emergency Contacts.
        </EmptyDescription>
      </EmptyHeader>
      {isAuthorizedForEdit() && <EmptyContent>
        <div className="flex gap-2">
          <Button>
            <Link href="/dashboard/emergency-services/add">Add Emergency Contact</Link>
            </Button>
        </div>
      </EmptyContent>}
    </Empty>
        )
      }
      {contacts.length !== 0 && filteredContacts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results found for &quot;{searchQuery}&quot; in {activeTab === 'all' ? 'all categories' : activeTab}.
        </div>
      )}
    </div>
  );
}