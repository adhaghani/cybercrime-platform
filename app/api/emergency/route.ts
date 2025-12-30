import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/emergency
 * List all emergency contacts
 * 
 * POST /api/emergency
 * Create a new emergency contact
 * 
 * Now proxies to OOP backend at /api/v2/emergency
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/emergency',
    includeAuth: false, // Public endpoint
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/emergency',
    method: 'POST',
    includeAuth: true,}
  );
}
