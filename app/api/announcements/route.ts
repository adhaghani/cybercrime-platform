import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/announcements
 * List all announcements
 * 
 * POST /api/announcements
 * Create a new announcement
 * 
 * Now proxies to OOP backend at /api/v2/announcements
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/announcements',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/announcements',
    method: 'POST',
    includeAuth: true,
  });
}
