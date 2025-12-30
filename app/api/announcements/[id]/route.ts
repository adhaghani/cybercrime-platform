import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/announcements/[id]
 * Get announcement by ID
 * 
 * PUT /api/announcements/[id]
 * Update announcement
 * 
 * DELETE /api/announcements/[id]
 * Delete announcement
 * 
 * Now proxies to OOP backend at /api/v2/announcements/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  return proxyToBackend(request, {
    path: `/announcements/${id}`,
    includeAuth: true,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/announcements/${id}`,
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
    path: `/announcements/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
