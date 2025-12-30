import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/reports/[id]/resolve
 * Resolve a report by creating a resolution record and updating report status to RESOLVED
 * 
 * Request body:
 * {
 *   resolutionType: 'RESOLVED' | 'ESCALATED' | 'DISMISSED' | 'TRANSFERRED',
 *   resolutionSummary: string,
 *   evidencePath?: string
 * }
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const reportId = resolvedParams.id;
  
  return proxyToBackend(request, {
    path: `/resolutions`,
    method: 'POST',
    includeAuth: true,
    transformRequest: (body) => ({
      ...body,
      reportId: reportId
    })
  });
}
