import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/teams
 * List all teams
 * 
 * POST /api/teams
 * Create a new team
 * 
 * Now proxies to OOP backend at /api/v2/teams
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/teams',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/teams',
    method: 'POST',
    includeAuth: true,
  });
}
