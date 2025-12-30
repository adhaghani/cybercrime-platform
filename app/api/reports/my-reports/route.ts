import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Route hit: /api/reports/my-reports');
    console.log('Query params:', request.nextUrl.searchParams.toString());
    
    const response = await proxyToBackend(request, {
      path: '/reports/my-reports',
      includeAuth: true,
      
    });
    
    console.log('✅ Proxy response status:', response.status);
    return response;
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Proxy failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET'
      },
      { status: 500 }
    );
  }
}