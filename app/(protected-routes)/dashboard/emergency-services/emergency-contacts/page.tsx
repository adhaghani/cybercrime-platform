"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MapPin, Search, Siren, Flame, Stethoscope, ShieldAlert, Pencil } from "lucide-react";
import { useHasAnyRole } from "@/hooks/use-user-role";
import Link from "next/link";
import { MOCK_NATIONAL_EMERGENCY_SERVICES } from "@/lib/api/mock-data";


export default function EmergencyContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const hasAnyRole = useHasAnyRole();
  const isAuthorizedForEdit = hasAnyRole(['ADMIN', 'SUPERADMIN', 'STAFF']);

  const filteredContacts = MOCK_NATIONAL_EMERGENCY_SERVICES.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeTab === "all" || contact.type?.toLowerCase().replace(" ", "-") === activeTab;

    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "Police": return <Siren className="h-5 w-5 text-blue-600" />;
      case "Fire": return <Flame className="h-5 w-5 text-orange-600" />;
      case "Medical": return <Stethoscope className="h-5 w-5 text-red-600" />;
      case "Civil Defence": return <ShieldAlert className="h-5 w-5 text-green-600" />;
      default: return <Phone className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="police">Police</TabsTrigger>
          <TabsTrigger value="fire">Fire</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="civil-defence" className="whitespace-normal text-center">Civil Defence</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold leading-tight">{contact.name}</CardTitle>
                  {getIcon(contact.type ? contact.type : "Unknown")}
              </div>
              <CardDescription className="font-medium text-primary">{contact.type} • {contact.state}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                <span>{contact.address}</span>
              </div>
              
              <div className="mt-auto flex gap-2 w-full items-center pt-4">

                  {contact.phone && (
                    <Button className="" variant="outline" asChild>
                        <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                            Office: {contact.phone}
                        </a>
                    </Button>
                  )}
                  {isAuthorizedForEdit ? <Button variant={"ghost"} asChild>
                  <Link href={`/dashboard/emergency-services/uitm-auxiliary-police/${contact.id}}/update`}>
                 <Pencil size={10} /> 
                 </Link>
                </Button> : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredContacts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results found for &quot;{searchQuery}&quot; in {activeTab === 'all' ? 'all categories' : activeTab}.
        </div>
      )}
    </div>
  );
}