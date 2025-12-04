"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Phone, AlertCircle, Shield, Siren, PlusCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EmergencyServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAnyRole = useHasAnyRole();
  const isStaffOrAdmin = hasAnyRole(['STAFF', 'ADMIN', 'SUPERADMIN']);

  // Mock statistics - replace with actual API calls
  const stats = {
    uitmPolice: 15,
    nationalServices: 42,
    total: 57,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">{children}</div>
      
      <aside className="w-full h-[calc(100vh-4rem)] sticky top-16 lg:w-80 ">
        <ScrollArea className="h-[calc(100vh-4rem)] shrink-0 space-y-6">
        {/* Quick Actions for Staff/Admin */}
        {isStaffOrAdmin && (
          <Card className="my-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="default" className="w-full justify-start" asChild>
                <Link href="/dashboard/emergency-services/add">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Emergency Service
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics for Staff/Admin */}
        {isStaffOrAdmin && (
          <Card  className="my-6"> 
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Service Statistics
              </CardTitle>
              <CardDescription>Emergency contacts overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Services</span>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>UiTM Police</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {stats.uitmPolice}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Siren className="h-4 w-4 text-red-500" />
                    <span>National Services</span>
                  </div>
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                    {stats.nationalServices}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* National Emergency Card */}
        {!isStaffOrAdmin && (<Card className="border-destructive shadow-md my-6">
          <CardHeader className="rounded-t-xl">
            <CardTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              National Emergency
            </CardTitle>
            <CardDescription>
              24-hour emergency hotlines (Malaysia)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground text-center">
                Police, Ambulance, Fire, Civil Defence
              </div>
              <Button variant="destructive" size="lg" className="w-full text-2xl font-black h-16" asChild>
                <a href="tel:999">999</a>
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground text-center">
                Worldwide Mobile Emergency
              </div>
               <Button variant="outline" size="lg" className="w-full text-xl font-bold h-12" asChild>
                <a href="tel:112">112</a>
              </Button>
            </div>
          </CardContent>
        </Card>)}

        {/* Other Hotlines */}
        {!isStaffOrAdmin && (<Card  className="my-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Other Hotlines
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex flex-col justify-between items-center last:border-0">
              <span>Befrienders (Suicide Helpline)</span>
              <a href="tel:03-76272929" className="block py-1 font-medium text-primary hover:underline block">03-7627 2929</a>
            </div>
            <Separator className="w-full"/>
            <div className="flex flex-col justify-between items-center last:border-0">
              <span>Talian Kasih</span>
              <a href="tel:15999" className="block py-1 font-medium text-primary hover:underline block">15999</a>
            </div>
          </CardContent>
        </Card>)}
        </ScrollArea>
      </aside>
    </div>
  );
}