import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/police/[id]
 * Get police contact by ID (public)
 * 
 * PUT /api/police/[id]
 * Update police contact details (auth required)
 * 
 * DELETE /api/police/[id]
 * Delete police contact (auth required)
 * 
 * Now proxies to OOP backend at /api/v2/police/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = getPathParam(request, 'id');
  return proxyToBackend(request, {
    path: `/police/${id}`,
    includeAuth: false, // Public endpoint
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = getPathParam(request, 'id');
  return proxyToBackend(request, {
    path: `/police/${id}`,
    method: 'PUT',
    includeAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = getPathParam(request, 'id');
  return proxyToBackend(request, {
    path: `/police/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
