"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Siren, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useHasAnyRole } from "@/hooks/use-user-role";




export default function EmergencyServicesPage() {
const hasAnyRole = useHasAnyRole();
  const isAuthorizedForAdd = () => {

  if(hasAnyRole(['ADMIN', 'SUPERADMIN', 'STAFF'])) return true;

  return false;
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emergency Services</h1>
        <p className="text-muted-foreground">
          Select a category to view detailed contact information.
        </p>
      </div>

      <div className={`grid gap-6 ${isAuthorizedForAdd() ? "md:grid-cols-3" : "md:grid-cols-2"} `}>
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Siren className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>National Emergency Contacts</CardTitle>
            <CardDescription>
              Directory for Royal Malaysia Police (PDRM), Fire and Rescue Department (Bomba), 
              Government Hospitals, and Civil Defence Force (APM).
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full group">
              <Link href="/dashboard/emergency-services/emergency-contacts">
                View National Contacts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>UiTM Auxiliary Police</CardTitle>
            <CardDescription>
              Dedicated security contacts for all Universiti Teknologi MARA (UiTM) campuses 
              across Malaysia.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full group">
              <Link href="/dashboard/emergency-services/uitm-auxiliary-police">
                View Campus Security
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        {isAuthorizedForAdd() &&<Card className="flex flex-col">
          <CardHeader>
            <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Add New Emergency Contact</CardTitle>
            <CardDescription>
              Add new emergency contact information for national or campus-specific services.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full group">
              <Link href="/dashboard/emergency-services/add">
                Add New Emergency Contact
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>}
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-2">About Emergency Services</h3>
        <p className="text-sm text-muted-foreground">
            This directory provides quick access to essential emergency contact numbers in Malaysia. 
            Always call <strong>999</strong> for life-threatening emergencies. For campus-specific security issues within UiTM premises, 
            please contact the respective Auxiliary Police units.
        </p>
      </div>
    </div>
  );
}
