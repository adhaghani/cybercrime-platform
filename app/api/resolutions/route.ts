import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/resolutions
 * List all resolutions (staff only)
 * Query params:
 *   - reportId: Filter by report ID
 *   - resolvedBy: Filter by staff who resolved
 *   - resolutionType: Filter by resolution type
 * 
 * Now proxies to OOP backend at /api/v2/resolutions
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/resolutions',
    includeAuth: true,
  });
}
