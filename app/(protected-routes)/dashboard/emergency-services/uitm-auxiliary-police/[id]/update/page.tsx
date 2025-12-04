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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

// Mock data for demonstration
const MOCK_UITM_POLICE = {
  id: "1",
  campus: "UiTM Shah Alam (Main Campus)",
  state: "Selangor",
  address: "Bangunan Keselamatan, UiTM Shah Alam, 40450 Shah Alam, Selangor",
  phone: "03-5544 2000",
  hotline: "03-5544 2222",
  email: "pb_uitm@uitm.edu.my",
  operatingHours: "24 Hours",
};

export default function UpdateUitmPolicePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [policeStation, setPoliceStation] = useState<typeof MOCK_UITM_POLICE | null>(null);

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
    // TODO: Fetch police station data from API
    // For now, using mock data
    if (params.id === "1") {
      setPoliceStation(MOCK_UITM_POLICE);
      form.reset({
        campus: MOCK_UITM_POLICE.campus,
        state: MOCK_UITM_POLICE.state,
        address: MOCK_UITM_POLICE.address,
        phone: MOCK_UITM_POLICE.phone,
        hotline: MOCK_UITM_POLICE.hotline,
        email: MOCK_UITM_POLICE.email,
        operatingHours: MOCK_UITM_POLICE.operatingHours,
      });
    }
  }, [params.id, form]);

  const onSubmit = async (data: UitmPoliceFormValues) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Updating UiTM police station:", { id: params.id, ...data });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push("/dashboard/emergency-services/uitm-auxiliary-police");
    } catch (error) {
      console.error("Error updating police station:", error);
      alert("Failed to update police station. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!policeStation) {
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