
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, MapPin, Search, Mail, Clock, Shield } from "lucide-react";
import { useHasAnyRole } from "@/hooks/use-user-role";
import Link from "next/link";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { UiTMAuxiliaryPolice } from "@/lib/types";
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
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { generateMetadata } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";
const ITEMS_PER_PAGE = 9;

export default function UitmAuxiliaryPolicePage() {
  const hasAnyRole = useHasAnyRole();
  const [policeStations, setPoliceStations] = useState<UiTMAuxiliaryPolice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        const response = await fetch('/api/police');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setPoliceStations(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching police stations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoliceStations();
  }, []);

  const isAuthorizedForEdit = () => {
    if(hasAnyRole(['STAFF','SUPERVISOR','ADMIN', 'SUPERADMIN'])) return true;
    return false;
  };

  const filteredStations = policeStations.filter((station) =>
    station.CAMPUS.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.STATE.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStations = filteredStations.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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

  generateMetadata({
    title: "UiTM Auxiliary Police - Cybercrime Reporting Platform",
    description: "Directory of UiTM Auxiliary Police (Polis Bantuan) units across all campuses in Malaysia.",
    canonical: "/dashboard/emergency-services/uitm-auxiliary-police",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">UiTM Auxiliary Police</h1>
        <p className="text-muted-foreground">
          Directory of UiTM Auxiliary Police (Polis Bantuan) units across all campuses in Malaysia.
        </p>
      </div>

      <div className="relative ">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by campus or state..."
          className="pl-8 max-w-xl"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedStations.map((station) => (
          <Card key={station.EMERGENCY_ID} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-start gap-2 w-full text-lg">{station.CAMPUS}
                {isAuthorizedForEdit() ? 
                <Tooltip>
                  <TooltipTrigger asChild>
                <Button variant={"outline"} size="icon-sm" asChild>
                  <Link href={`/dashboard/emergency-services/uitm-auxiliary-police/${station.EMERGENCY_ID}/update`}>
                 <Pencil size={10} /> 
                 </Link>
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Edit
                </TooltipContent>
                </Tooltip> : null}
              </CardTitle>
              <CardDescription>{station.STATE}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex-col space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{station.ADDRESS}</span>
              </div>
              
              <div className="flex flex-col gap-3 ">
                <div className="flex items-center gap-3 text-sm">
                   <Mail className="h-4 w-4 shrink-0" />
                   <span>{station.EMAIL}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Clock className="h-4 w-4 shrink-0" />
                   <span>{station.OPERATING_HOURS}</span>
                </div>

              </div>
            </CardContent>
            <CardFooter className="gap-2 flex-wrap">                
                <Button className="w-full" variant="destructive">
                        Emergency: {station.HOTLINE}
                </Button>
                 {station.PHONE && (
                    <Button className="w-full" variant="outline">
                            Office: {station.PHONE}
                    </Button>
                 )}</CardFooter>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && filteredStations.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredStations.length}
        />
      )}
      {
        policeStations.length === 0 && (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Shield />
        </EmptyMedia>
        <EmptyTitle>No UiTM Auxiliary Police Data Yet</EmptyTitle>
        <EmptyDescription>
          The system currently has no records of UiTM Auxiliary Police units.
        </EmptyDescription>
      </EmptyHeader>
      {isAuthorizedForEdit() && <EmptyContent>
        <div className="flex gap-2">
          <Button>
            <Link href="/dashboard/emergency-services/add">Add UiTM Auxiliary Police Unit</Link>
            </Button>
        </div>
      </EmptyContent>}
    </Empty>
        )
      }
      {policeStations.length !== 0 && filteredStations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}