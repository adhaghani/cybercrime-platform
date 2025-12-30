import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/[id]
 * Get report by ID
 * 
 * PUT /api/reports/[id]
 * Update report
 * 
 * DELETE /api/reports/[id]
 * Delete report
 * 
 * Now proxies to OOP backend at /api/v2/reports/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/reports/${id}`,
    includeAuth: true,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/reports/${id}`,
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
    path: `/reports/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
