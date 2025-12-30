/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Proxy Utility
 * Forwards requests from Next.js API routes to the OOP backend
 */

import { NextRequest, NextResponse } from 'next/server';

// New OOP Backend URL
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000/api/v2';

export interface ProxyOptions {
  /** Path to append to backend URL (e.g., '/reports' or '/crimes/123') */
  path?: string;
  /** HTTP method override (default: uses request method) */
  method?: string;
  /** Include auth token from cookies */
  includeAuth?: boolean;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Pre-parsed body to send (if already consumed from request) */
  body?: any;
  /** Transform request body before sending */
  transformRequest?: (body: any) => any;
  /** Transform response data before returning */
  transformResponse?: (data: any) => any;
}

/**
 * Generic proxy function to forward requests to the OOP backend
 */
export async function proxyToBackend(
  request: NextRequest,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  try {
    const {
      path = '',
      method = request.method,
      includeAuth = true,
      headers: customHeaders = {},
      body: providedBody,
      transformRequest,
      transformResponse,
    } = options;

    // Get auth token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // Build URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const url = queryString
      ? `${BACKEND_URL}${fullPath}?${queryString}`
      : `${BACKEND_URL}${fullPath}`;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Add auth token if available and requested
    if (includeAuth && token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Prepare request body
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      // Use provided body if available, otherwise read from request
      const requestBody = providedBody !== undefined 
        ? providedBody 
        : await request.json().catch(() => ({}));
      const transformedBody = transformRequest
        ? transformRequest(requestBody)
        : requestBody;
      body = JSON.stringify(transformedBody);
    }

    // Make request to backend
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body,
    });

    // Parse response
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Transform response if needed
    const transformedData = transformResponse ? transformResponse(data) : data;

    // Return response with same status code
    return NextResponse.json(transformedData, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Extract path parameter from request URL
 */
export function getPathParam(request: NextRequest, paramName: string): string | null {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  
  // Find the param (usually after 'api' and the resource name)
  // Example: /api/reports/123 -> ['api', 'reports', '123']
  const apiIndex = pathSegments.indexOf('api');
  if (apiIndex >= 0 && apiIndex + 2 < pathSegments.length) {
    return pathSegments[apiIndex + 2];
  }
  
  return null;
}

/**
 * Helper to set auth cookie in response
 */
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

/**
 * Helper to clear auth cookie
 */
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete('auth_token');
  return response;
}
