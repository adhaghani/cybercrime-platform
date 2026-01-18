import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/teams/performance-metrics
 * Get performance metrics for all teams
 * 
 * Proxies to OOP backend at /api/v2/teams/performance-metrics/all
 */
export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/teams/performance-metrics/all',
    includeAuth: true,
  });
}
