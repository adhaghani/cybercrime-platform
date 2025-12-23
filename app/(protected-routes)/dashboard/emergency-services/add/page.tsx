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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const uitmPoliceSchema = z.object({
  campus: z.string().min(1, "Campus name is required").max(200, "Campus name is too long"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(10, "Address must be at least 10 characters").max(500, "Address is too long"),
  phone: z.string().min(9, "Phone number must be at least 9 characters").max(20, "Phone number is too long"),
  hotline: z.string().min(9, "Hotline must be at least 9 characters").max(20, "Hotline is too long"),
  email: z.string().email("Invalid email address"),
  operatingHours: z.string().min(1, "Operating hours is required"),
});

const nationalEmergencySchema = z.object({
  name: z.string().min(1, "Service name is required").max(200, "Service name is too long"),
  type: z.string().min(1, "Service type is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(10, "Address must be at least 10 characters").max(500, "Address is too long"),
  phone: z.string().min(9, "Phone number must be at least 9 characters").max(20, "Phone number is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type UitmPoliceFormData = z.infer<typeof uitmPoliceSchema>;
type NationalEmergencyFormData = z.infer<typeof nationalEmergencySchema>;

export default function AddEmergencyServicePage() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<"uitm" | "national">("uitm");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uitmForm = useForm<UitmPoliceFormData>({
    resolver: zodResolver(uitmPoliceSchema),
    defaultValues: {
      campus: "",
      state: "",
      address: "",
      phone: "",
      hotline: "",
      email: "",
      operatingHours: "24 Hours",
    },
  });

  const nationalForm = useForm<NationalEmergencyFormData>({
    resolver: zodResolver(nationalEmergencySchema),
    defaultValues: {
      name: "",
      type: "",
      state: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  const onUitmSubmit = async (data: UitmPoliceFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/police', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campus: data.campus,
          state: data.state,
          address: data.address,
          phone: data.phone,
          hotline: data.hotline,
          email: data.email,
          operating_hours: data.operatingHours,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save');
      router.push("/dashboard/emergency-services/uitm-auxiliary-police");
    } catch (error) {
      console.error("Error saving UiTM police station:", error);
      alert("Failed to save UiTM police station. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onNationalSubmit = async (data: NationalEmergencyFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          state: data.state,
          address: data.address,
          phone: data.phone,
          email: data.email || undefined,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save');
      router.push("/dashboard/emergency-services/emergency-contacts");
    } catch (error) {
      console.error("Error saving national emergency service:", error);
      alert("Failed to save national emergency service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
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
              <form onSubmit={uitmForm.handleSubmit(onUitmSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="campus">Campus Name *</Label>
                    <Input
                      id="campus"
                      placeholder="e.g., UiTM Shah Alam (Main Campus)"
                      {...uitmForm.register("campus")}
                    />
                    {uitmForm.formState.errors.campus && (
                      <p className="text-sm text-destructive">{uitmForm.formState.errors.campus.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uitm-state">State *</Label>
                    <Controller
                      name="state"
                      control={uitmForm.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
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
                      )}
                    />
                    {uitmForm.formState.errors.state && (
                      <p className="text-sm text-destructive">{uitmForm.formState.errors.state.message}</p>
                    )}
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
                    rows={3}
                    {...uitmForm.register("address")}
                  />
                  {uitmForm.formState.errors.address && (
                    <p className="text-sm text-destructive">{uitmForm.formState.errors.address.message}</p>
                  )}
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
                      {...uitmForm.register("phone")}
                    />
                    {uitmForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{uitmForm.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotline">Emergency Hotline *</Label>
                    <Input
                      id="hotline"
                      type="tel"
                      placeholder="03-5544 2222"
                      {...uitmForm.register("hotline")}
                    />
                    {uitmForm.formState.errors.hotline && (
                      <p className="text-sm text-destructive">{uitmForm.formState.errors.hotline.message}</p>
                    )}
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
                      {...uitmForm.register("email")}
                    />
                    {uitmForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{uitmForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operating-hours" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Operating Hours *
                    </Label>
                    <Input
                      id="operating-hours"
                      placeholder="24 Hours"
                      {...uitmForm.register("operatingHours")}
                    />
                    {uitmForm.formState.errors.operatingHours && (
                      <p className="text-sm text-destructive">{uitmForm.formState.errors.operatingHours.message}</p>
                    )}
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
              <form onSubmit={nationalForm.handleSubmit(onNationalSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Service Name *</Label>
                  <Input
                    id="service-name"
                    placeholder="e.g., Ibu Pejabat Polis Kontinjen (IPK) Selangor"
                    {...nationalForm.register("name")}
                  />
                  {nationalForm.formState.errors.name && (
                    <p className="text-sm text-destructive">{nationalForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Service Type *</Label>
                    <Controller
                      name="type"
                      control={nationalForm.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
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
                      )}
                    />
                    {nationalForm.formState.errors.type && (
                      <p className="text-sm text-destructive">{nationalForm.formState.errors.type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="national-state">State/Territory *</Label>
                    <Controller
                      name="state"
                      control={nationalForm.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
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
                      )}
                    />
                    {nationalForm.formState.errors.state && (
                      <p className="text-sm text-destructive">{nationalForm.formState.errors.state.message}</p>
                    )}
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
                    rows={3}
                    {...nationalForm.register("address")}
                  />
                  {nationalForm.formState.errors.address && (
                    <p className="text-sm text-destructive">{nationalForm.formState.errors.address.message}</p>
                  )}
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
                      {...nationalForm.register("phone")}
                    />
                    {nationalForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{nationalForm.formState.errors.phone.message}</p>
                    )}
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
                      {...nationalForm.register("email")}
                    />
                    {nationalForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{nationalForm.formState.errors.email.message}</p>
                    )}
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