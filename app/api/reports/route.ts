import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports
 * List all reports with optional filtering
 * Query params: type, status, submitted_by
 * 
 * POST /api/reports
 * Create a new report
 * 
 * Now proxies to OOP backend at /api/v2/reports
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    method: 'POST',
    includeAuth: true,});
}
