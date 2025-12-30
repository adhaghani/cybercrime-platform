import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/emergency/[id]
 * Get emergency contact by ID
 * 
 * PUT /api/emergency/[id]
 * Update emergency contact
 * 
 * DELETE /api/emergency/[id]
 * Delete emergency contact
 * 
 * Now proxies to OOP backend at /api/v2/emergency/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  return proxyToBackend(request, {
    path: `/emergency/${id}`,
    includeAuth: false, // Public endpoint
  });
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/emergency/${id}`,
    method: 'PUT',
    includeAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/emergency/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
