import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/report-assignments/by-report/[reportId]
 * Get all assignments for a specific report
 * 
 * Now proxies to OOP backend at /api/v2/report-assignments/by-report/:reportId
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const reportId = await getPathParam(params, 'reportId');
  return proxyToBackend(request, {
    path: `/report-assignments/by-report/${reportId}`,
    includeAuth: true,
  });
}
