import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/report-assignments/by-staff/[staffId]
 * Get all assignments for a specific staff member
 * 
 * Now proxies to OOP backend at /api/v2/report-assignments/by-staff/:staffId
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  const staffId = await getPathParam(params, 'staffId');
  return proxyToBackend(request, {
    path: `/report-assignments/by-staff/${staffId}`,
    includeAuth: true,
  });
}
