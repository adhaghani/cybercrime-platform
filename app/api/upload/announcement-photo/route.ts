import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/upload/announcement-photo
 * Upload announcement photo
 * Expects multipart/form-data with 'file' and optional 'announcementId'
 * 
 * Now proxies to OOP backend at /api/v2/upload/announcement-photo
 */

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/upload/announcement-photo',
    method: 'POST',
    includeAuth: true,
  });
}
