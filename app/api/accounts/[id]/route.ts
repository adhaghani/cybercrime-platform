import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/accounts/[id]
 * Get account by ID
 * 
 * PUT /api/accounts/[id]
 * Update account
 * 
 * DELETE /api/accounts/[id]
 * Delete account
 * 
 * Now proxies to OOP backend at /api/v2/accounts/:id
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/accounts/${id}`,
    includeAuth: true,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/accounts/${id}`,
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
    path: `/accounts/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}