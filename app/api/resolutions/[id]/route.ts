import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/resolutions/[id]
 * Get resolution by ID
 * 
 * PUT /api/resolutions/[id]
 * Update resolution
 * 
 * DELETE /api/resolutions/[id]
 * Delete resolution
 * 
 * Now proxies to OOP backend at /api/v2/resolutions/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/resolutions/${id}`,
    includeAuth: true,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/resolutions/${id}`,
    method: 'PUT',
    includeAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/resolutions/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
