import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/crimes/report/[reportId]
 * Get crime details by report ID
 * 
 * PUT /api/crimes/report/[reportId]
 * Update crime details
 * 
 * DELETE /api/crimes/report/[reportId]
 * Delete crime record
 * 
 * Now proxies to OOP backend at /api/v2/crimes/report/:reportId
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const reportId = await getPathParam(params, 'reportId');
  return proxyToBackend(request, {
    path: `/crimes/report/${reportId}`,
    includeAuth: false, // Public endpoint, auth is optional
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const reportId = await getPathParam(params, 'reportId');
  return proxyToBackend(request, {
    path: `/crimes/report/${reportId}`,
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
    path: `/crimes/report/${reportId}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
