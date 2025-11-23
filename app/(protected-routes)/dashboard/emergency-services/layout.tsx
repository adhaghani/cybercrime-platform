import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, AlertCircle } from "lucide-react";

export default function EmergencyServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">{children}</div>
      
      <aside className="w-full h-fit sticky top-16 lg:w-80 shrink-0 space-y-6">
        <Card className="border-destructive shadow-md">
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
        </Card>

        <Card>
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
        </Card>
      </aside>
    </div>
  );
}