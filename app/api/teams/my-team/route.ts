import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/teams/my-team
 * Get the current user's team
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/teams/my-team',
    includeAuth: true,
  });
}
