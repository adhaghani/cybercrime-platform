import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/facilities/[reportId]
 * Get facility details by report ID
 * 
 * PUT /api/facilities/[reportId]
 * Update facility details
 * 
 * DELETE /api/facilities/[reportId]
 * Delete facility record
 * 
 * Now proxies to OOP backend at /api/v2/facilities/:reportId
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const reportId = await getPathParam(params, 'reportId');
  return proxyToBackend(request, {
    path: `/facilities/${reportId}`,
    includeAuth: false, // Public endpoint, auth is optional
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const reportId = await getPathParam(params, 'reportId');
  return proxyToBackend(request, {
    path: `/facilities/${reportId}`,
    method: 'PUT',
    includeAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const reportId = await getPathParam(params, 'reportId');
  return proxyToBackend(request, {
    path: `/facilities/${reportId}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
