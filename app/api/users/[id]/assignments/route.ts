import { NextRequest } from 'next/server';
import { proxyToBackend, getPathParam } from '@/lib/api/proxy';

/**
 * GET /api/users/[id]/assignments
 * Get all assignments for a specific staff user
 * 
 * Now proxies to OOP backend at /api/v2/users/:id/assignments
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await getPathParam(params, 'id');
  return proxyToBackend(request, {
    path: `/users/${id}/assignments`,
    includeAuth: true,
  });
}
