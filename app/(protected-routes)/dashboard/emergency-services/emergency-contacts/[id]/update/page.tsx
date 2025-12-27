"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Siren, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EmergencyInfo } from "@/lib/types";
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
  const [contact, setContact] = useState<EmergencyInfo | null>(null);

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
    const fetchEmergencyContact = async () => {
      try {
        const response = await fetch(`/api/emergency/${params.id}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        setContact(data);
        form.reset({
          name: data.NAME,
          type: data.TYPE,
          state: data.STATE,
          address: data.ADDRESS,
          phone: data.PHONE,
          email: data.EMAIL || '',
        });
      } catch (error) {
        console.error('Error fetching emergency contact:', error);
      }
    };
    fetchEmergencyContact();
  }, [params.id, form]);

  const onSubmit = async (data: EmergencyContactFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/emergency/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          state: data.state,
          address: data.address,
          phone: data.phone,
          email: data.email,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update');
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
    <div className="space-y-6 max-w-6xl mx-auto w-full">
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  Delete Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this contact?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Please confirm if you want to proceed with deleting this emergency contact.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const response = await fetch(`/api/emergency/${params.id}`, {
                          method: 'DELETE',
                        });
                        if (!response.ok) throw new Error('Failed to delete');
                        router.push("/dashboard/emergency-services/emergency-contacts");
                      } catch (error) {
                        console.error("Error deleting emergency contact:", error);
                        alert("Failed to delete emergency contact. Please try again.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Contact"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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