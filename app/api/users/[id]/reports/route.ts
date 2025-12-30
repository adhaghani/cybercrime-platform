import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/users/[id]/reports
 * Get all reports submitted by a specific user
 * 
 * Now proxies to OOP backend at /api/v2/users/:id/reports
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/users/${id}/reports`,
    includeAuth: true,
  });
}
