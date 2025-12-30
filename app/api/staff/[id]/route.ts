import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/staff/[id]
 * Get staff by account ID
 * 
 * PUT /api/staff/[id]
 * Update staff details
 * 
 * DELETE /api/staff/[id]
 * Delete staff record
 * 
 * Now proxies to OOP backend at /api/v2/staff/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/staff/${id}`,
    includeAuth: true,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/staff/${id}`,
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
    path: `/staff/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
