import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/students/search
 * Advanced search for students
 * Query params: q, program, semester, year, page, limit
 * 
 * Now proxies to OOP backend at /api/v2/students/search
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/students/search',
    includeAuth: true,
  });
}
