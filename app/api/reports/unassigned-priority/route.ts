import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/unassigned-priority
 * Get unassigned reports with priority scores using complex subqueries
 * Query params: type (optional: CRIME or FACILITY)
 * 
 * Proxies to OOP backend at /api/v2/reports/unassigned-priority
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/unassigned-priority',
    includeAuth: true,
  });
}
