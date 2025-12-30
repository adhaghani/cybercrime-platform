import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/announcements/by-audience
 * Get announcements filtered by audience
 * Query params: audience (required), status, page, limit
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/announcements/by-audience',
    includeAuth: false,
  });
}
