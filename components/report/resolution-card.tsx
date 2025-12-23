/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Resolution } from '@/lib/types';
import { CheckCircle2, AlertCircle, ArrowUpCircle, ArrowRightCircle, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ResolutionCardProps {
  reportId: string;
}

const resolutionTypeConfig = {
  RESOLVED: {
    icon: CheckCircle2,
    label: 'Resolved',
    variant: 'default' as const,
    color: 'text-green-600',
  },
  ESCALATED: {
    icon: ArrowUpCircle,
    label: 'Escalated',
    variant: 'secondary' as const,
    color: 'text-orange-600',
  },
  DISMISSED: {
    icon: AlertCircle,
    label: 'Dismissed',
    variant: 'outline' as const,
    color: 'text-gray-600',
  },
  TRANSFERRED: {
    icon: ArrowRightCircle,
    label: 'Transferred',
    variant: 'secondary' as const,
    color: 'text-blue-600',
  },
};

export function ResolutionCard({ reportId }: ResolutionCardProps) {
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResolution();
  }, [reportId]);

  const fetchResolution = async () => {
    try {
      const response = await fetch(`/api/resolutions?reportId=${reportId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setResolution(null);
          return;
        }
        throw new Error('Failed to fetch resolution');
      }

      const data = await response.json();
      // Assuming the API returns an array, get the first one
      setResolution(data.resolutions?.[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resolution');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!resolution) {
    return null; // No resolution yet
  }

  const config = resolutionTypeConfig[resolution.resolutionType];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            Resolution Details
          </CardTitle>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        <CardDescription>
          Report has been {config.label.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Summary</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {resolution.resolutionSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Resolved At</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(resolution.resolvedAt), 'PPP p')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Resolved By</p>
              <p className="text-sm text-muted-foreground">
                Staff ID: {resolution.resolvedBy}
              </p>
            </div>
          </div>

          {resolution.evidencePath && (
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Evidence</p>
                <a
                  href={resolution.evidencePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {resolution.evidencePath}
                </a>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
