"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, MapPin, Search, Mail, Clock } from "lucide-react";
import { useHasAnyRole } from "@/hooks/use-user-role";
import Link from "next/link";
import { MOCK_UITM_AUXILIARY_POLICE } from "@/lib/api/mock-data";





export default function UitmAuxiliaryPolicePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const hasAnyRole = useHasAnyRole();
  const isAuthorizedForEdit = hasAnyRole(['ADMIN', 'SUPERADMIN']);

  const filteredStations = MOCK_UITM_AUXILIARY_POLICE.filter((station) =>
    station.campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">UiTM Auxiliary Police</h1>
        <p className="text-muted-foreground">
          Directory of UiTM Auxiliary Police (Polis Bantuan) units across all campuses in Malaysia.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by campus or state..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStations.map((station) => (
          <Card key={station.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-start gap-2 w-full text-lg">{station.campus}
                {isAuthorizedForEdit ? <Button variant={"ghost"} asChild>
                  <Link href={`/dashboard/emergency-services/uitm-auxiliary-police/${station.id}/update`}>
                 <Pencil size={10} /> 
                 </Link>
                </Button> : null}
              </CardTitle>
              <CardDescription>{station.state}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{station.address}</span>
              </div>
              
              <div className="flex flex-wrap gap-3 items-center ">
                <div className="flex items-center gap-3 text-sm">
                   <Mail className="h-4 w-4 shrink-0" />
                   <span>{station.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Clock className="h-4 w-4 shrink-0" />
                   <span>{station.operatingHours}</span>
                </div>

              </div>
            </CardContent>
            <CardFooter className="gap-2 flex-wrap">                
                <Button className="w-full" variant="destructive">
                        Emergency: {station.hotline}
                </Button>
                 {station.phone && (
                    <Button className="w-full" variant="outline">
                            Office: {station.phone}
                    </Button>
                 )}</CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredStations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}