import { proxyToBackend } from '@/lib/api/proxy';
import { NextRequest } from 'next/server';

/**
 * GET /api/system/health
 * Public endpoint to check system and database health status
 */
export async function GET(request: NextRequest) {
    return proxyToBackend(request, {    
     path: '/health',
     includeAuth: false, // No authentication required for health check
   });
}
