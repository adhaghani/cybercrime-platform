import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/announcements/search
 * Advanced search for announcements
 * Query params: q, priority, type, audience, status, page, limit
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/announcements/search',
    includeAuth: false,
  });
}
