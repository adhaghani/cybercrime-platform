import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/students
 * List all students
 * 
 * POST /api/students
 * Create a new student record
 * 
 * Now proxies to OOP backend at /api/v2/students
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/students',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/students',
    method: 'POST',
    includeAuth: true,
  });
}
