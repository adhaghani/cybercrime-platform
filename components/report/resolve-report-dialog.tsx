'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ResolutionType } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface ResolveReportDialogProps {
  reportId: string;
  reportTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ResolveReportDialog({
  reportId,
  reportTitle,
  open,
  onOpenChange,
  onSuccess,
}: ResolveReportDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    resolutionType: 'RESOLVED' as ResolutionType,
    resolutionSummary: '',
    evidencePath: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolutionType: formData.resolutionType,
          resolutionSummary: formData.resolutionSummary,
          evidencePath: formData.evidencePath || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resolve report');
      }

      toast.success('Report resolved successfully');

      // Reset form
      setFormData({
        resolutionType: 'RESOLVED',
        resolutionSummary: '',
        evidencePath: '',
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.success((error as Error).message || 'An error occurred while resolving the report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Create a resolution for: <strong>{reportTitle}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolutionType">Resolution Type *</Label>
              <Select
                value={formData.resolutionType}
                onValueChange={(value: ResolutionType) =>
                  setFormData({ ...formData, resolutionType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="ESCALATED">Escalated</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.resolutionType === 'RESOLVED' && 'Issue has been successfully resolved'}
                {formData.resolutionType === 'ESCALATED' && 'Issue requires higher authority'}
                {formData.resolutionType === 'DISMISSED' && 'Issue is not valid or actionable'}
                {formData.resolutionType === 'TRANSFERRED' && 'Issue transferred to another department'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolutionSummary">Resolution Summary *</Label>
              <Textarea
                id="resolutionSummary"
                value={formData.resolutionSummary}
                onChange={(e) =>
                  setFormData({ ...formData, resolutionSummary: e.target.value })
                }
                placeholder="Describe the actions taken and outcome..."
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Provide detailed information about how the issue was handled
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidencePath">Evidence Path (Optional)</Label>
              <Input
                id="evidencePath"
                value={formData.evidencePath}
                onChange={(e) =>
                  setFormData({ ...formData, evidencePath: e.target.value })
                }
                placeholder="/uploads/evidence/file.pdf"
              />
              <p className="text-xs text-muted-foreground">
                Path to supporting documents or evidence
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Resolution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
