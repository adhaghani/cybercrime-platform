import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Shield, Ambulance, Flame, MapPin, Siren } from "lucide-react";
import { MOCK_NATIONAL_EMERGENCY_SERVICES, MOCK_UITM_AUXILIARY_POLICE } from "@/lib/api/mock-data";

export default function EmergencyContactPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Emergency Contacts</h1>
        <p className="text-xl text-muted-foreground">
          If you are in immediate danger, please call <span className="font-bold text-red-500">999</span> or your local emergency number immediately.
        </p>
      </div>

      {/* National Emergency Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Siren className="h-6 w-6 text-red-500" />
          National Emergency Services
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {MOCK_NATIONAL_EMERGENCY_SERVICES.map((service) => {
            let Icon = Shield;
            if (service.type === "Fire") Icon = Flame;
            if (service.type === "Medical") Icon = Ambulance;
            if (service.type === "Civil Defence") Icon = Siren;

            return (
              <Card key={service.id} className="flex flex-col h-full border-t-4 border-t-red-500">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-red-50 text-red-500 dark:bg-red-900/20">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">{service.address}</p>
                  </div>
                  <Button variant="destructive" className="w-full gap-2" asChild>
                    <a href={`tel:${service.phone}`}>
                      <Phone className="h-4 w-4" />
                      Call {service.phone}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* UiTM Auxiliary Police */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          UiTM Auxiliary Police
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_UITM_AUXILIARY_POLICE.map((police) => (
            <Card key={police.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">{police.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{police.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Operating Hours: {police.operatingHours}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4">
                  <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
                    <a href={`tel:${police.phone}`}>
                      <Phone className="h-4 w-4" />
                      {police.phone}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-background border shadow-sm">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Campus Location</h3>
              <p className="text-muted-foreground">
                123 University Avenue<br />
                Tech District, CA 94043
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">View Campus Map</Button>
            <Button>Get Directions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
