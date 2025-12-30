import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/generated-reports/[id]/download
 * Download a generated report file
 * 
 * Now proxies to OOP backend at /api/v2/generated-reports/:id/download
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/generated-reports/${id}/download`,
    includeAuth: true,
  });
}
