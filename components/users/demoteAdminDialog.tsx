'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ShieldAlert, AlertTriangle } from 'lucide-react';

interface DemoteAdminDialogProps {
  accountId: string | null;
  adminName?: string;
  currentRole?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DemoteAdminDialog({ 
  accountId, 
  adminName = 'this administrator',
  currentRole = 'ADMIN',
  open, 
  onOpenChange,
  onSuccess 
}: DemoteAdminDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDemote = async () => {
    if (!accountId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/staff/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'STAFF',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to revoke admin access');
      }

      toast.success(`Successfully revoked admin access from ${adminName}`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Demote admin error:', error);
      toast.error((error as Error).message || 'Failed to revoke admin access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            Revoke Admin Access
          </DialogTitle>
          <DialogDescription>
            Remove administrative privileges from {adminName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> This will remove all administrative privileges from this user. 
              They will be demoted to regular staff member and lose access to admin functions.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Current Status:</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Role:</span>
              <span className="text-sm font-semibold">{currentRole}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">New Role:</span>
              <span className="text-sm font-semibold">STAFF</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            The user will be notified of this change and will need to contact an administrator 
            if they require elevated privileges in the future.
          </p>
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
            variant="destructive"
            onClick={handleDemote}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Revoking Access...
              </>
            ) : (
              <>
                <ShieldAlert className="mr-2 h-4 w-4" />
                Revoke Admin Access
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
