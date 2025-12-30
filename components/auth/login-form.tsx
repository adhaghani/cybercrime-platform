
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { login } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/auth-provider";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { passwordComplexity,  StaffEmailRegex, StudentEmailRegex } from "@/lib/constant";
import { toast } from "sonner";
const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .refine(
      (email) => StudentEmailRegex.test(email) || StaffEmailRegex.test(email),
      "Need to use UiTM email"
    ),
  password: z
    .string()
    .min(8, "invalid password")
    .regex(passwordComplexity, "invalid password"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClaims } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      setIsLoading(true);

      const data = await login({
        email: value.email,
        password: value.password,
      });
      console.log("[LoginForm] Login successful, user data:", data);
      // Set user claims  
      setClaims({
        ACCOUNT_ID: data.ACCOUNT_ID,
        EMAIL: data.EMAIL,
        NAME: data.NAME,
        CONTACT_NUMBER: data.CONTACT_NUMBER,
        AVATAR_URL: data.AVATAR_URL,
        ACCOUNT_TYPE: data.ACCOUNT_TYPE,
        ...(( "STUDENT_ID" in data) ? {
          STUDENT_ID: data.STUDENT_ID,
          PROGRAM: data.PROGRAM,
          SEMESTER: data.SEMESTER,
          YEAR_OF_STUDY: data.YEAR_OF_STUDY,
        } : {
          STAFF_ID: data.STAFF_ID,
          DEPARTMENT: data.DEPARTMENT,
          POSITION: data.POSITION,
          ROLE: data.ROLE,
        }),
        CREATED_AT: data.CREATED_AT,
        UPDATED_AT: data.UPDATED_AT,
      });

      // Get redirect URL from searchParams or default to dashboard
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if(error){
    toast.error(error);
  }

  return (
    <div className={cn("flex", className)} {...props}>
      <Card className="w-full max-w-sm border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="email"
                        placeholder="youremailaddress@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center gap-2 flex-wrap">
                      Password
                      <Link
                        className="!text-primary hover:underline"
                        href="/auth/forgot-password"
                      >
                        Forgot password?
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
