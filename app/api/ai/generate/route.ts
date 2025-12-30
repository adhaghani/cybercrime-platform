import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/ai/generate
 * Generate AI responses using LM Studio or similar backend AI service
 * 
 * Now proxies to OOP backend at /api/v2/ai/generate
 * Backend handles the LM Studio integration
 */

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/ai/generate',
    method: 'POST',
    includeAuth: false, // AI generation may be public or auth-optional
  });
}
