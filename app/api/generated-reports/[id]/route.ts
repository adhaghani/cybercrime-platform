import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/generated-reports/[id]
 * Get generated report by ID
 * 
 * DELETE /api/generated-reports/[id]
 * Delete generated report
 * 
 * Now proxies to OOP backend at /api/v2/generated-reports/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  return proxyToBackend(request, {
    path: `/generated-reports/${id}`,
    includeAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/generated-reports/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
