"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Siren, Save, Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UITM_CAMPUS } from "@/lib/constant";
import { generateMetadata } from "@/lib/seo";
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

  generateMetadata({
    title: "Add Emergency Service - Cybercrime Reporting Platform",
    description: "Add a new emergency service contact to the Cybercrime Reporting Platform.",
    canonical: "/dashboard/emergency-services/add",
  });

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
    console.log(data);
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
              <Form {...uitmForm}>
                <form onSubmit={uitmForm.handleSubmit(onUitmSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={uitmForm.control}
                      name="campus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campus Name *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select campus" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {UITM_CAMPUS.map((state, stateIndex) => (
                                <div key={state.name}>
                                  {state.campuses.map((campus) => (
                                    <SelectItem key={`${state.name}-${campus}`} value={`UiTM ${campus} (${state.name})`}>
                                      {campus} ({state.name})
                                    </SelectItem>
                                  ))}
                                  {stateIndex < UITM_CAMPUS.length - 1 && <SelectSeparator />}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={uitmForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {UITM_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={uitmForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Full address of the police station"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={uitmForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="03-5544 2000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={uitmForm.control}
                      name="hotline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-red-500" />
                            Emergency Hotline *
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="03-5544 2222" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={uitmForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="pb_uitm@uitm.edu.my" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={uitmForm.control}
                      name="operatingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Operating Hours *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="24 Hours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
              </Form>
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
              <Form {...nationalForm}>
                <form onSubmit={nationalForm.handleSubmit(onNationalSubmit)} className="space-y-6">
                  <FormField
                    control={nationalForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Ibu Pejabat Polis Kontinjen (IPK) Selangor"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={nationalForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EMERGENCY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={nationalForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Territory *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MALAYSIAN_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={nationalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Full address of the emergency service"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={nationalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="03-5514 5222" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={nationalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@example.gov.my" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}