'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Role } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Supervisor {
  accountId: string;
  name: string;
  department: string;
}

const staffSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  contactNumber: z.string().min(9, "Contact number must be at least 9 characters").optional().or(z.literal("")),
  role: z.enum(["STAFF", "SUPERVISOR", "ADMIN", "SUPERADMIN"] as const),
  department: z.string().min(1, "Department is required").max(100, "Department is too long"),
  position: z.string().min(1, "Position is required").max(100, "Position is too long"),
  supervisorId: z.string().optional().or(z.literal("")),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function AddStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [currentUser, setCurrentUser] = useState<{ role: Role; accountId: string } | null>(null);
  
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      contactNumber: '',
      role: 'STAFF',
      department: '',
      position: '',
      supervisorId: '',
    },
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchSupervisors();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser({ role: data.role, accountId: data.accountId });
        
        // If current user is SUPERVISOR, auto-assign their ID
        if (data.role === 'SUPERVISOR') {
          form.setValue('supervisorId', data.accountId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const response = await fetch('/api/staff?role=SUPERVISOR');
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
      const accountResponse = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          contactNumber: data.contactNumber || undefined,
          accountType: 'STAFF',
        }),
      });

      if (!accountResponse.ok) {
        const error = await accountResponse.json();
        throw new Error(error.message || 'Failed to create account');
      }

      const { accountId } = await accountResponse.json();

      // Then create staff record
      const staffResponse = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          role: data.role,
          department: data.department,
          position: data.position,
          supervisorId: data.supervisorId || null,
        }),
      });

      if (!staffResponse.ok) {
        const error = await staffResponse.json();
        throw new Error(error.message || 'Failed to create staff record');
      }

      toast.success('Staff member added successfully');

      router.push('/dashboard/user-management/staff');
    } catch (error) {
        toast.error((error as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const canSelectSupervisor = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN';

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Staff Member</CardTitle>
          <CardDescription>
            {currentUser?.role === 'SUPERVISOR'
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
                    {...form.register("contactNumber")}
                  />
                  {form.formState.errors.contactNumber && (
                    <p className="text-sm text-destructive">{form.formState.errors.contactNumber.message}</p>
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
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STAFF">Staff</SelectItem>
                          <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                          {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN') && (
                            <>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              {currentUser?.role === 'SUPERADMIN' && (
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
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    {...form.register("department")}
                  />
                  {form.formState.errors.department && (
                    <p className="text-sm text-destructive">{form.formState.errors.department.message}</p>
                  )}
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

                {canSelectSupervisor && (
                  <div className="space-y-2">
                    <Label htmlFor="supervisorId">Supervisor</Label>
                    <Controller
                      name="supervisorId"
                      control={form.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supervisor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No Supervisor</SelectItem>
                            {supervisors.map((supervisor) => (
                              <SelectItem key={supervisor.accountId} value={supervisor.accountId}>
                                {supervisor.name} - {supervisor.department}
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