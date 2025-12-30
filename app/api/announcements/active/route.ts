import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/announcements/active
 * Get active announcements (published and within date range)
 * Query params: audience, priority, limit
 * 
 * Now proxies to OOP backend at /api/v2/announcements/active
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/announcements/active',
    includeAuth: false, // Public endpoint
  });
}
