'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteUserDialogProps {
  accountId: string | null;
  userName?: string;
  userEmail?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteUserDialog({ 
  accountId, 
  userName = 'this user',
  userEmail,
  open, 
  onOpenChange,
  onSuccess 
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const CONFIRM_PHRASE = 'DELETE';

  const handleDelete = async () => {
    if (!accountId) return;
    
    if (confirmText !== CONFIRM_PHRASE) {
      toast.error(`Please type "${CONFIRM_PHRASE}" to confirm deletion`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user account');
      }

      toast.success(`Successfully deleted account for ${userName}`);
      setConfirmText('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error((error as Error).message || 'Failed to delete user account');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmText('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete User Account
          </DialogTitle>
          <DialogDescription>
            Permanently remove {userName} from the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-sm text-destructive">
              <strong>Warning:</strong> This action cannot be undone. All data associated with this 
              account will be permanently deleted, including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>User profile and personal information</li>
                <li>Report submissions and assignments</li>
                <li>Activity history and logs</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm text-muted-foreground min-w-20">Name:</span>
              <span className="text-sm font-medium">{userName}</span>
            </div>
            {userEmail && (
              <div className="flex items-start gap-2">
                <span className="text-sm text-muted-foreground min-w-20">Email:</span>
                <span className="text-sm font-medium">{userEmail}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-sm text-muted-foreground min-w-20">Account ID:</span>
              <span className="text-sm font-mono">{accountId}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              Type <span className="font-bold text-destructive">{CONFIRM_PHRASE}</span> to confirm deletion
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="font-mono"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className='ml-2'
            onClick={handleDelete}
            disabled={loading || confirmText !== CONFIRM_PHRASE}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
