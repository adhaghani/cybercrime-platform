import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * DELETE /api/reports/bulk-delete
 * Delete multiple reports at once
 * Body: { ids: string[] }
 */

export async function DELETE(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/bulk-delete',
    method: 'DELETE',
    includeAuth: true,
  });
}
