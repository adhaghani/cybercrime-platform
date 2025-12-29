'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordComplexity, StaffEmailRegex,StaffIDRegex } from '@/lib/constant';
import { useAuth } from '@/lib/context/auth-provider';
import { Staff } from '@/lib/types';
import { signUp } from '@/lib/api/auth';
import { STAFF_DEPARTMENT } from '@/lib/constant';

const staffSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").regex(StaffEmailRegex, "Need to use UiTM Staff email"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(passwordComplexity, "Password must include uppercase, lowercase, number and symbol"),
  contact_number: z.string().min(9, "Contact number must be at least 9 characters").optional().or(z.literal("")),
  role: z.enum(["STAFF", "SUPERVISOR", "ADMIN", "SUPERADMIN"] as const),
  department: z.string().min(1, "Department is required").max(100, "Department is too long"),
  position: z.string().min(1, "Position is required").max(100, "Position is too long"),
  staffID: z.string().regex(StaffIDRegex, "Invalid Staff ID"),
  supervisorID: z.string().optional().or(z.literal("")),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function AddStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState<Staff[]>([]);
  const {claims} = useAuth();
  const currentUser = claims as Staff;
  const isCurrentUserSupervisor = currentUser?.ROLE === 'SUPERVISOR';
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      contact_number: '',
      role: 'STAFF',
      department: '',
      position: '',
      staffID: '',
      supervisorID: '',
    },
  });

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setSupervisors(data.staff || []);
      }
    } catch (error) {
      console.error('Failed to fetch supervisors:', error);
    }
  };

  const onSubmit = async (data: StaffFormData) => {
    setLoading(true);

    try {
      // First create account
      const response = await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        contact_number: data.contact_number || '',
        account_type: 'STAFF',
        // Staff specific fields can be added here if needed
        staffID: data.staffID,
        supervisorID: data.supervisorID ? data.supervisorID : isCurrentUserSupervisor ? currentUser.ACCOUNT_ID : undefined,
        department: data.department,
        position: data.position,
        role: data.role,
      });
      if(!response.message){
        throw new Error('Account creation failed');
      }
      
      // Then associate staff details
      toast.success('Staff member added successfully');
      router.push('/dashboard/user-management/staff');
    } catch (error) {
        toast.error((error as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const Supervisor = supervisors.filter(s => s.ROLE === 'SUPERVISOR');

  const canSelectSupervisor = currentUser?.ROLE === 'ADMIN' || currentUser?.ROLE === 'SUPERADMIN';
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Staff Member</CardTitle>
          <CardDescription>
            {currentUser?.ROLE === 'SUPERVISOR'
              ? 'Staff will be automatically added to your team'
              : 'Fill in the details to add a new staff member'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    {...form.register("contact_number")}
                  />
                  {form.formState.errors.contact_number && (
                    <p className="text-sm text-destructive">{form.formState.errors.contact_number.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Staff Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Staff Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select role"  />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STAFF">Staff</SelectItem>
                          <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                          {(currentUser?.ROLE === 'ADMIN' || currentUser?.ROLE === 'SUPERADMIN') && (
                            <>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              {currentUser?.ROLE === 'SUPERADMIN' && (
                                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.role && (
                    <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffID">Staff ID *</Label>
                  <Input
                    id="staffID"
                    {...form.register("staffID")}
                  />
                  {form.formState.errors.staffID && (
                    <p className="text-sm text-destructive">{form.formState.errors.staffID.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Controller
                    name="department"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            STAFF_DEPARTMENT.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    {...form.register("position")}
                  />
                  {form.formState.errors.position && (
                    <p className="text-sm text-destructive">{form.formState.errors.position.message}</p>
                  )}
                </div>

                {canSelectSupervisor && supervisors.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="supervisorID">Supervisor</Label>
                    <Controller
                      name="supervisorID"
                      control={form.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supervisor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NULL">No Supervisor</SelectItem>
                            {Supervisor.map((supervisor) => (
                              <SelectItem key={supervisor.ACCOUNT_ID} value={String(supervisor.ACCOUNT_ID)}>
                                {supervisor.NAME} - {supervisor.DEPARTMENT}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Staff Member
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}