"use client";

import { cn } from "@/lib/utils";
import { signUp } from "@/lib/api/auth";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { passwordComplexity, StudentEmailRegex, StudentIDRegex } from "@/lib/constant";
import { toast } from "sonner"; // Add this import

// Step 1 schema
const step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").regex(StudentEmailRegex, "Need to use UiTM Student email"),
  contact_number: z.string().min(10, "Contact number must be at least 10 characters"),
});

// Step 2 schema - Student Information
const step2Schema = z.object({
  studentID: z.string().regex(StudentIDRegex, "Invalid Student ID (10 digits required)"),
  program: z.string().min(2, "Program is required"),
  semester: z.coerce.number().min(1, "Semester must be at least 1").max(14, "Semester cannot exceed 14"),
  year_of_study: z.coerce.number().min(1, "Year must be at least 1").max(7, "Year cannot exceed 7"),
});

// Step 3 schema - Password
const step3Schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        passwordComplexity,
        "Password must include uppercase, lowercase, number and symbol"
      ),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);

  const router = useRouter();

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      email: "",
      contact_number: "",
    },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema) as any,
    defaultValues: {
      studentID: "",
      program: "",
      semester: 1,
      year_of_study: 1,
    },
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
    setError(null);
  };

  const onStep2Submit = (data: Step2Data) => {
    setStep2Data(data);
    setStep(3);
    setError(null);
  };

  const onStep3Submit = async (data: Step3Data) => {
    if (!step1Data || !step2Data) return;
    
    setError(null);
    try {
      setIsLoading(true);

      // Prepare data matching backend expectations
      const signUpData = {
        name: step1Data.name,
        email: step1Data.email,
        password: data.password,
        contact_number: step1Data.contact_number,
        account_type: "STUDENT",
        studentID: step2Data.studentID,
        program: step2Data.program,
        semester: step2Data.semester,
        year_of_study: step2Data.year_of_study,
      };

      console.log("📝 Step 1 Data:", step1Data);
      console.log("📝 Step 2 Data:", step2Data);
      console.log("📝 Step 3 Data:", data);
      console.log("🚀 Sending to backend:", signUpData);
      console.log("🔗 API URL should be: http://localhost:3001/api/auth/register"); // PORT 5000!

      const result = await signUp(signUpData);
      console.log("✅ Backend response:", result);
      
      toast.success("Account created successfully!");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("❌ Sign up error:", error);
      console.error("❌ Error details:", error.response || error);
      setError(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setError(null);
  };

  const handleBackToStep2 = () => {
    setStep(2);
    setError(null);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            {step === 1 && "Step 1 of 3: Personal Information"}
            {step === 2 && "Step 2 of 3: Student Information"}
            {step === 3 && "Step 3 of 3: Set Password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          
          {step === 1 && (
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-5" autoComplete="off">
                <FormField
                  control={form1.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form1.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="youremailaddress@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form1.control}
                  name="contact_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="012-3456789"
                          autoComplete="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Next
                </Button>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...form2} key="step2-form">
              <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-5" autoComplete="off">
                <FormField
                  control={form2.control}
                  name="studentID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 2025160493"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Computer Science"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form2.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="14"
                            placeholder="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="year_of_study"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Study</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="7"
                            placeholder="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToStep1}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === 3 && (
            <Form {...form3} key="step3-form">
              <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-5" autoComplete="off">
                <FormField
                  control={form3.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form3.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToStep2}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
          
          <div className="mt-4 text-center text-sm">
            already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}