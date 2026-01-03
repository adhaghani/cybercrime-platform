'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsAdmin } from '@/hooks/use-user-role';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PromoteStaffDialogProps {
  accountId: string | null;
  staffName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PromoteStaffDialog({
  accountId,
  staffName = 'this staff member',
  open,
  onOpenChange,
  onSuccess
}: PromoteStaffDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'SUPERVISOR'>('ADMIN');
  const isAdmin = useIsAdmin();

  const handlePromote = async () => {
    if (!accountId) return;

    // Client-side permission check
    if (!isAdmin) {
      toast.error('You do not have permission to promote staff. Only ADMIN and SUPERADMIN users can perform this action.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/staff/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to promote staff';
        try {
          const error = await response.json();
          if (response.status === 403 && error.error === 'Insufficient permissions') {
            errorMessage = 'You do not have permission to promote staff. Only ADMIN and SUPERADMIN users can perform this action.';
          } else {
            errorMessage = error.error || errorMessage;
          }
        } catch (jsonError) {
          // Response wasn't JSON, get text instead
          const textError = await response.text();
          errorMessage = textError || errorMessage;
          toast.error(errorMessage);
          return;
        }
        throw new Error(errorMessage);
      }

      toast.success(`Successfully promoted ${staffName} to ${selectedRole}`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Promote staff error:', error);
      toast.error((error as Error).message || 'Failed to promote staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-500" />
            Promote Staff Member
          </DialogTitle>
          <DialogDescription>
            Promote {staffName} to a higher role with additional privileges
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3 p-4 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <p className="text-sm text-orange-800 dark:text-orange-200">
              This will grant elevated permissions to the staff member. Make sure this is the intended action.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select New Role</Label>
            <Select value={selectedRole} onValueChange={(value: 'ADMIN' | 'SUPERVISOR') => setSelectedRole(value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPERVISOR">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Supervisor</span>
                    <span className="text-xs text-muted-foreground">Can manage team members and assignments</span>
                  </div>
                </SelectItem>
                <SelectItem value="ADMIN">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Administrator</span>
                    <span className="text-xs text-muted-foreground">Full system access and user management</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The staff member will be notified of their role change
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePromote}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Promoting...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Promote to {selectedRole}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
