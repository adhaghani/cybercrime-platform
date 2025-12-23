'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Staff } from '@/lib/types';

interface AssignStaffDialogProps {
  reportId: string;
  reportTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignStaffDialog({
  reportId,
  reportTitle,
  open,
  onOpenChange,
  onSuccess,
}: AssignStaffDialogProps) {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    if (open) {
      fetchStaffList();
    }
  }, [open]);

  const fetchStaffList = async () => {
    setLoadingStaff(true);
    try {
      // Fetch current user's team members (for supervisors) or all staff (for admins)
      const response = await fetch('/api/staff');
      if (!response.ok) throw new Error('Failed to fetch staff');
      
      const data = await response.json();
      setStaffList(data.staff || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStaff) {
      toast.error('Please select a staff member to assign the report');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/report-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          accountId: selectedStaff,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign report');
      }

      toast.success('Report assigned successfully');

      // Reset form
      setSelectedStaff('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error((error as Error).message || 'An error occurred while assigning the report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleAssign}>
          <DialogHeader>
            <DialogTitle>Assign Report to Staff</DialogTitle>
            <DialogDescription>
              Assign <strong>{reportTitle}</strong> to a staff member for handling
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staff">Select Staff Member *</Label>
              {loadingStaff ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger id="staff">
                    <SelectValue placeholder="Choose a staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.length === 0 ? (
                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                        No staff members available
                      </div>
                    ) : (
                      staffList.map((staff) => (
                        <SelectItem key={staff.accountId} value={staff.accountId}>
                          {staff.name} ({staff.position || staff.role})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                The selected staff member will be notified of this assignment
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedStaff}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
