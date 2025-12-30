import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * PUT /api/report-assignments/[id]
 * Update report assignment (action taken, feedback, etc.)
 * 
 * DELETE /api/report-assignments/[id]
 * Delete report assignment
 * 
 * Now proxies to OOP backend at /api/v2/report-assignments/:id
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return proxyToBackend(request, {
    path: `/report-assignments/${id}`,
    method: 'PUT',
    includeAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return proxyToBackend(request, {
    path: `/report-assignments/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
