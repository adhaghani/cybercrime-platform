import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * PUT /api/report-assignments/bulk-update
 * Update multiple report assignments at once
 * Body: { updates: Array<{ id: string, data: Partial<Assignment> }> }
 * 
 * Now proxies to OOP backend at /api/v2/report-assignments/bulk-update
 */

export async function PUT(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/report-assignments/bulk-update',
    method: 'PUT',
    includeAuth: true,
  });
}
