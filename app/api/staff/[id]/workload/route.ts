import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/staff/workload
 * Get staff workload
 * 
 * Now proxies to OOP backend at /api/v2/staff/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/staff/${id}/workload`,
    includeAuth: true,
  });
}