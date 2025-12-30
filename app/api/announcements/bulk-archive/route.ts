import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/announcements/bulk-archive
 * Archive multiple announcements at once
 * Body: { ids: string[] }
 */

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/announcements/bulk-archive',
    method: 'POST',
    includeAuth: true,
  });
}
