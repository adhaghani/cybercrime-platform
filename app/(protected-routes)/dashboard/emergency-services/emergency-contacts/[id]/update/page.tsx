"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Siren, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const emergencyContactSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters").max(150, "Name is too long"),
  type: z.enum(["Police", "Fire", "Medical", "Civil Defence"] as const),
  state: z.string().min(2, "State is required").max(50, "State name is too long"),
  address: z.string().min(10, "Address must be at least 10 characters").max(300, "Address is too long"),
  phone: z.string().min(8, "Phone number must be at least 8 characters").max(20, "Phone number is too long"),
  email: z.string().email("Invalid email address").max(100, "Email is too long").optional().or(z.literal("")),
});

type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>;

// Mock data for demonstration
const MOCK_EMERGENCY_CONTACT = {
  id: "1",
  name: "Ibu Pejabat Polis Kontinjen (IPK) Selangor",
  type: "Police" as const,
  state: "Selangor",
  address: "Persiaran Masjid, Seksyen 9, 40000 Shah Alam, Selangor",
  phone: "03-5514 5222",
  email: "ipk.selangor@rmp.gov.my",
};

const MALAYSIAN_STATES = [
  "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka",
  "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Putrajaya",
  "Sabah", "Sarawak", "Selangor", "Terengganu"
];

const EMERGENCY_TYPES = ["Police", "Fire", "Medical", "Civil Defence"];

export default function UpdateEmergencyContactPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState<typeof MOCK_EMERGENCY_CONTACT | null>(null);

  const form = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: "",
      type: "Police",
      state: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    // TODO: Fetch emergency contact data from API
    // For now, using mock data
    if (params.id === "1") {
      setContact(MOCK_EMERGENCY_CONTACT);
      form.reset({
        name: MOCK_EMERGENCY_CONTACT.name,
        type: MOCK_EMERGENCY_CONTACT.type,
        state: MOCK_EMERGENCY_CONTACT.state,
        address: MOCK_EMERGENCY_CONTACT.address,
        phone: MOCK_EMERGENCY_CONTACT.phone,
        email: MOCK_EMERGENCY_CONTACT.email || "",
      });
    }
  }, [params.id, form]);

  const onSubmit = async (data: EmergencyContactFormValues) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Updating emergency contact:", { id: params.id, ...data });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push("/dashboard/emergency-services/emergency-contacts");
    } catch (error) {
      console.error("Error updating emergency contact:", error);
      alert("Failed to update emergency contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!contact) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/emergency-services/emergency-contacts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Siren className="h-8 w-8 text-red-500" />
            Update Emergency Contact
          </h1>
          <p className="text-muted-foreground">
            Modify the national emergency service contact information
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Service Information</CardTitle>
              <CardDescription>Update the contact details for this emergency service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ibu Pejabat Polis Kontinjen (IPK) Selangor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Territory *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                      <FormDescription>
                        Email contact for non-emergency inquiries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Emergency Contact
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}