import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/emergency/public
 * Get all public emergency contacts (no auth required)
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/emergency/public/all',
    includeAuth: false,
  });
}
