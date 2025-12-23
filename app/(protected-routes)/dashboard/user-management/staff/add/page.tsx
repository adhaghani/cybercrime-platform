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

interface Supervisor {
  accountId: string;
  name: string;
  department: string;
}

export default function AddStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [currentUser, setCurrentUser] = useState<{ role: Role; accountId: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    role: 'STAFF' as Role,
    department: '',
    position: '',
    supervisorId: '',
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
          setFormData(prev => ({ ...prev, supervisorId: data.accountId }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create account
      const accountResponse = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contactNumber: formData.contactNumber,
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
          role: formData.role,
          department: formData.department,
          position: formData.position,
          supervisorId: formData.supervisorId || null,
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Staff Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Staff Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: Role) => setFormData({ ...formData, role: value })}
                  >
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>

                {canSelectSupervisor && (
                  <div className="space-y-2">
                    <Label htmlFor="supervisorId">Supervisor</Label>
                    <Select
                      value={formData.supervisorId}
                      onValueChange={(value) => setFormData({ ...formData, supervisorId: value })}
                    >
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