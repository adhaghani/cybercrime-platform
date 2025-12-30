import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/upload/profile-picture
 * Upload profile picture
 * Expects multipart/form-data with 'file' and 'accountId'
 * 
 * Now proxies to OOP backend at /api/v2/upload/profile-picture
 */

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/upload/profile-picture',
    method: 'POST',
    includeAuth: true,
  });
}
