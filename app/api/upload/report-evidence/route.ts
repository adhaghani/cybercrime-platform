import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/upload/report-evidence
 * Upload report evidence file
 * Expects multipart/form-data with 'file' and optional 'reportId'
 * 
 * Now proxies to OOP backend at /api/v2/upload/report-evidence
 */

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/upload/report-evidence',
    method: 'POST',
    includeAuth: true,
  });
}
