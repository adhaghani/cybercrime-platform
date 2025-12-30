import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/students/[id]
 * Get student by account ID
 * 
 * PUT /api/students/[id]
 * Update student details
 * 
 * DELETE /api/students/[id]
 * Delete student record
 * 
 * Now proxies to OOP backend at /api/v2/students/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/students/${id}`,
    includeAuth: true,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/students/${id}`,
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
    path: `/students/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
