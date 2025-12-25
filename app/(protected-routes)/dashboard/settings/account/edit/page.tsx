"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-provider";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  contactNumber: z.string().min(10, {
    message: "Contact number must be at least 10 characters.",
  }),
  // Student fields
  program: z.string().optional(),
  semester: z.string().optional(),
  yearOfStudy: z.string().optional(),
  // Staff fields
  department: z.string().optional(),
  position: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsProfilePage() {
  const { claims, setClaims } = useAuth();
  const router = useRouter();
  const role = claims?.ROLE;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      contactNumber: "",
      program: "",
      semester: "",
      yearOfStudy: "",
      department: "",
      position: "",
    },
    mode: "onChange",
  });

  // Reset form when claims are loaded
  useEffect(() => {
    if (claims) {
      form.reset({
        name: claims?.NAME || "",
        contactNumber: (claims?.CONTACT_NUMBER as string) || "",
        program: (claims?.PROGRAM as string) || "",
        semester: claims?.SEMESTER?.toString() || "",
        yearOfStudy: claims?.YEAR_OF_STUDY?.toString() || "",
        department: (claims?.DEPARTMENT as string) || "",
        position: (claims?.POSITION as string) || "",
      });
    }
  }, [claims, form]);

  function onSubmit(data: ProfileFormValues) {
    // Update via API
    const updateAccount = async () => {
      try {
        const accountId = claims?.ACCOUNT_ID;
        if (!accountId) return;

        const response = await fetch(`/api/accounts/${accountId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            contact_number: data.contactNumber,
            ...(role === 'STUDENT' ? {
              student_id: claims?.STUDENT_ID,
              program: data.program,
              semester: data.semester ? parseInt(data.semester) : undefined,
              year_of_study: data.yearOfStudy ? parseInt(data.yearOfStudy) : undefined,
            } : {}),
            ...((role === 'STAFF' || role === 'SUPERVISOR' || role === 'ADMIN' || role === 'SUPERADMIN') ? {
              staff_id: claims?.STAFF_ID,
              department: data.department,
              position: data.position,
            } : {}),
          }),
        });

        if (!response.ok) throw new Error('Failed to update');

        // Update local claims
        if (claims) {
          const updatedClaims = {
            ...claims,
            NAME: data.name,
            CONTACT_NUMBER: data.contactNumber,
            ...(role === 'STUDENT' ? {
              STUDENT_ID: claims?.STUDENT_ID,
              PROGRAM: data.program,
              SEMESTER: data.semester ? parseInt(data.semester) : claims.SEMESTER,
              YEAR_OF_STUDY: data.yearOfStudy ? parseInt(data.yearOfStudy) : claims.YEAR_OF_STUDY,
            } : {}),
            ...((role === 'STAFF' || role === 'SUPERVISOR' || role === 'ADMIN' || role === 'SUPERADMIN') ? {
              STAFF_ID: claims?.STAFF_ID,
              DEPARTMENT: data.department,
              POSITION: data.position,
            } : {}),
            
            
          };
          setClaims(updatedClaims);
        }

        toast.success("Profile updated successfully");
        router.push("/dashboard/settings/account");
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error("Failed to update profile. Please try again.");
      }
    };
    updateAccount();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/settings/account">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h3 className="text-lg font-medium">Edit Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal information.
          </p>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+60..." {...field} />
                </FormControl>
                <FormDescription>
                  Your primary contact number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Student Fields */}
          {role === 'STUDENT' && (
            <>
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CS240" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Study</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {/* Staff Fields */}
          {(role === 'STAFF' || role === 'ADMIN') && (
            <>
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. FSKM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Lecturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </div>
  );
}
