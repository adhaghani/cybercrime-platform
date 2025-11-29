"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Siren, Save, Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// UiTM States for campus selection
const UITM_STATES = [
  "Selangor", "Kuala Lumpur", "Johor", "Kedah", "Kelantan", "Melaka", 
  "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", 
  "Sabah", "Sarawak", "Terengganu"
];

// National Emergency Service Types
const EMERGENCY_TYPES = [
  "Police", "Fire", "Medical", "Civil Defence"
];

// Malaysian States
const MALAYSIAN_STATES = [
  "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka",
  "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Putrajaya",
  "Sabah", "Sarawak", "Selangor", "Terengganu"
];

export default function AddEmergencyServicePage() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<"uitm" | "national">("uitm");

  // UiTM Police Form State
  const [uitmData, setUitmData] = useState({
    campus: "",
    state: "",
    address: "",
    phone: "",
    hotline: "",
    email: "",
    operatingHours: "24 Hours",
  });

  // National Emergency Service Form State
  const [nationalData, setNationalData] = useState({
    name: "",
    type: "",
    state: "",
    address: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUitmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: API call to save UiTM police station
      console.log("Saving UiTM Police Station:", uitmData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect after success
      router.push("/dashboard/emergency-services/uitm-auxiliary-police");
    } catch (error) {
      console.error("Error saving UiTM police station:", error);
      alert("Failed to save UiTM police station. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNationalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: API call to save national emergency service
      console.log("Saving National Emergency Service:", nationalData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect after success
      router.push("/dashboard/emergency-services/emergency-contacts");
    } catch (error) {
      console.error("Error saving national emergency service:", error);
      alert("Failed to save national emergency service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/emergency-services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Emergency Service</h1>
          <p className="text-muted-foreground">
            Add a new UiTM Auxiliary Police station or National Emergency Service contact
          </p>
        </div>
      </div>

      <Tabs value={serviceType} onValueChange={(v) => setServiceType(v as "uitm" | "national")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="uitm" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            UiTM Auxiliary Police
          </TabsTrigger>
          <TabsTrigger value="national" className="flex items-center gap-2">
            <Siren className="h-4 w-4" />
            National Emergency
          </TabsTrigger>
        </TabsList>

        {/* UiTM Auxiliary Police Form */}
        <TabsContent value="uitm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>UiTM Auxiliary Police Station Details</CardTitle>
              <CardDescription>
                Add a new UiTM campus police station or security office
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUitmSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="campus">Campus Name *</Label>
                    <Input
                      id="campus"
                      placeholder="e.g., UiTM Shah Alam (Main Campus)"
                      value={uitmData.campus}
                      onChange={(e) => setUitmData({ ...uitmData, campus: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uitm-state">State *</Label>
                    <Select
                      value={uitmData.state}
                      onValueChange={(v) => setUitmData({ ...uitmData, state: v })}
                      required
                    >
                      <SelectTrigger id="uitm-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {UITM_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Full address of the police station"
                    value={uitmData.address}
                    onChange={(e) => setUitmData({ ...uitmData, address: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="03-5544 2000"
                      value={uitmData.phone}
                      onChange={(e) => setUitmData({ ...uitmData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotline">Emergency Hotline *</Label>
                    <Input
                      id="hotline"
                      type="tel"
                      placeholder="03-5544 2222"
                      value={uitmData.hotline}
                      onChange={(e) => setUitmData({ ...uitmData, hotline: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="pb_uitm@uitm.edu.my"
                      value={uitmData.email}
                      onChange={(e) => setUitmData({ ...uitmData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operating-hours" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Operating Hours *
                    </Label>
                    <Input
                      id="operating-hours"
                      placeholder="24 Hours"
                      value={uitmData.operatingHours}
                      onChange={(e) => setUitmData({ ...uitmData, operatingHours: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Police Station"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* National Emergency Service Form */}
        <TabsContent value="national" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>National Emergency Service Details</CardTitle>
              <CardDescription>
                Add a new national emergency service contact (Police, Fire, Medical, Civil Defence)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNationalSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Service Name *</Label>
                  <Input
                    id="service-name"
                    placeholder="e.g., Ibu Pejabat Polis Kontinjen (IPK) Selangor"
                    value={nationalData.name}
                    onChange={(e) => setNationalData({ ...nationalData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Service Type *</Label>
                    <Select
                      value={nationalData.type}
                      onValueChange={(v) => setNationalData({ ...nationalData, type: v })}
                      required
                    >
                      <SelectTrigger id="service-type">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMERGENCY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="national-state">State/Territory *</Label>
                    <Select
                      value={nationalData.state}
                      onValueChange={(v) => setNationalData({ ...nationalData, state: v })}
                      required
                    >
                      <SelectTrigger id="national-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {MALAYSIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="national-address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address *
                  </Label>
                  <Textarea
                    id="national-address"
                    placeholder="Full address of the emergency service"
                    value={nationalData.address}
                    onChange={(e) => setNationalData({ ...nationalData, address: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="national-phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="national-phone"
                      type="tel"
                      placeholder="03-5514 5222"
                      value={nationalData.phone}
                      onChange={(e) => setNationalData({ ...nationalData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="national-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address (Optional)
                    </Label>
                    <Input
                      id="national-email"
                      type="email"
                      placeholder="contact@example.gov.my"
                      value={nationalData.email}
                      onChange={(e) => setNationalData({ ...nationalData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Emergency Service"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}