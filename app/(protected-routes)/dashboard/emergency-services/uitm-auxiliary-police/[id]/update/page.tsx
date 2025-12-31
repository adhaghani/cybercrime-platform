"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2, Shield, Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateMetadata } from "@/lib/seo";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UiTMAuxiliaryPolice } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
const uitmPoliceSchema = z.object({
  campus: z.string().min(3, "Campus name must be at least 3 characters").max(100, "Campus name is too long"),
  state: z.string().min(2, "State is required").max(50, "State name is too long"),
  address: z.string().min(10, "Address must be at least 10 characters").max(300, "Address is too long"),
  phone: z.string().min(8, "Phone number must be at least 8 characters").max(20, "Phone number is too long"),
  hotline: z.string().min(8, "Hotline must be at least 8 characters").max(20, "Hotline is too long"),
  email: z.string().email("Invalid email address").max(100, "Email is too long"),
  operatingHours: z.string().min(3, "Operating hours required").max(50, "Operating hours is too long"),
});

type UitmPoliceFormValues = z.infer<typeof uitmPoliceSchema>;

export default function UpdateUitmPolicePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [policeStation, setPoliceStation] = useState<UiTMAuxiliaryPolice | null>(null);

  const form = useForm<UitmPoliceFormValues>({
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

  useEffect(() => {
    const fetchPoliceStation = async () => {
      try {
        const response = await fetch(`/api/police/${params.id}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        setPoliceStation(data);
        form.reset({
          campus: data.CAMPUS,
          state: data.STATE,
          address: data.ADDRESS,
          phone: data.PHONE,
          hotline: data.HOTLINE,
          email: data.EMAIL,
          operatingHours: data.OPERATING_HOURS || '24 Hours',
        });
      } catch (error) {
        console.error('Error fetching police station:', error);
      }
    };
    fetchPoliceStation();
  }, [params.id, form]);

  const onSubmit = async (data: UitmPoliceFormValues) => {
    setIsLoading(true);
    console.log("Submitting update with data:", data);
    try {
      const response = await fetch(`/api/police/${params.id}`, {
        method: 'PUT',
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
      
      if (!response.ok) throw new Error('Failed to update');
      router.push("/dashboard/emergency-services/uitm-auxiliary-police");
    } catch (error) {
      console.error("Error updating police station:", error);
      alert("Failed to update police station. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  generateMetadata({
    title: "Update UiTM Auxiliary Police - Cybercrime Reporting Platform",
    description: "Modify the police station contact information on the Cybercrime Reporting Platform.",
    canonical: `/dashboard/emergency-services/uitm-auxiliary-police/${params.id}/update`,
  });

  if (!policeStation) {
    return (
          <div className="space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
    );
  }

  
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/emergency-services/uitm-auxiliary-police">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            Update UiTM Auxiliary Police
          </h1>
          <p className="text-muted-foreground">
            Modify the police station contact information
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Police Station Information</CardTitle>
              <CardDescription>Update the contact details for this UiTM campus police station</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="campus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., UiTM Shah Alam (Main Campus)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Selangor" {...field} />
                      </FormControl>
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  Delete Station
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the police station record.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const response = await fetch(`/api/police/${params.id}`, {
                          method: 'DELETE',
                        });
                        if (!response.ok) throw new Error('Failed to delete');
                        router.push("/dashboard/emergency-services/uitm-auxiliary-police");
                      } catch (error) {
                        console.error("Error deleting police station:", error);
                        alert("Failed to delete police station. Please try again.");
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
                      "Delete"
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
                  Update Police Station
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}