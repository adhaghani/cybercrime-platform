import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/accounts
 * List all accounts
 * 
 * POST /api/accounts
 * Create a new account
 * 
 * Now proxies to OOP backend at /api/v2/accounts
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/accounts',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/accounts',
    method: 'POST',
    includeAuth: true,
  });
}
