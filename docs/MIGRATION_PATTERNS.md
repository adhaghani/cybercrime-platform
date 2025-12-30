#!/bin/bash

# Script to help migrate remaining API routes to use the proxy utility
# This shows examples of how to update each type of route

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "          API Route Migration Helper"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This guide shows patterns for migrating different route types."
echo ""

cat << 'EOF'

📝 PATTERN 1: Simple GET Route
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE:
────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/endpoint`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return NextResponse.json(await response.json());
}
────────────────────────────────────────────────────────────

AFTER:
────────────────────────────────────────────────────────────
import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/endpoint',
    includeAuth: true,
  });
}
────────────────────────────────────────────────────────────


📝 PATTERN 2: POST Route with Body
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE:
────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const body = await request.json();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/endpoint`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return NextResponse.json(await response.json());
}
────────────────────────────────────────────────────────────

AFTER:
────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/endpoint',
    method: 'POST',
    includeAuth: true,
  });
}
────────────────────────────────────────────────────────────


📝 PATTERN 3: Dynamic Route with ID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For routes like: /api/reports/[id]/route.ts

BEFORE:
────────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('auth_token')?.value;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${params.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return NextResponse.json(await response.json());
}
────────────────────────────────────────────────────────────

AFTER:
────────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(request, {
    path: `/reports/${params.id}`,
    includeAuth: true,
  });
}
────────────────────────────────────────────────────────────


📝 PATTERN 4: Route with Query Parameters
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Query params are automatically forwarded by the proxy!

BEFORE:
────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reports?status=${status}`;
  const response = await fetch(url);
  return NextResponse.json(await response.json());
}
────────────────────────────────────────────────────────────

AFTER:
────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  // Query params automatically included!
  return proxyToBackend(request, {
    path: '/reports',
    includeAuth: true,
  });
}
────────────────────────────────────────────────────────────


📝 PATTERN 5: PUT/DELETE Routes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AFTER:
────────────────────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(request, {
    path: `/reports/${params.id}`,
    method: 'PUT',
    includeAuth: true,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(request, {
    path: `/reports/${params.id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}
────────────────────────────────────────────────────────────


📝 PATTERN 6: Public Route (No Auth)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AFTER:
────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/announcements/active',
    includeAuth: false, // ← No authentication required
  });
}
────────────────────────────────────────────────────────────


📝 PATTERN 7: Multiple Methods in One File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AFTER:
────────────────────────────────────────────────────────────
import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    method: 'POST',
    includeAuth: true,
  });
}

export async function PUT(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    method: 'PUT',
    includeAuth: true,
  });
}

export async function DELETE(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    method: 'DELETE',
    includeAuth: true,
  });
}
────────────────────────────────────────────────────────────


🔧 STEP-BY-STEP MIGRATION PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open the API route file
2. Add import: import { proxyToBackend } from '@/lib/api/proxy';
3. Replace fetch logic with proxyToBackend call
4. Set correct path (matches backend route)
5. Set includeAuth: true for protected routes
6. Save and test the route
7. Mark as complete in docs/API_MIGRATION_STATUS.md


✅ TESTING EACH ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After updating each route, test it:

# Test GET
curl http://localhost:3000/api/your-route

# Test POST
curl -X POST http://localhost:3000/api/your-route \
  -H 'Content-Type: application/json' \
  -d '{"key":"value"}'

# Test with authentication
curl http://localhost:3000/api/your-route \
  -H 'Cookie: auth_token=YOUR_TOKEN'


🎯 PRIORITY ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Migrate in this order for maximum impact:

1. Authentication routes ✅ (Already done)
2. Core report routes ✅ (Already done)
3. Dynamic report routes ([id])
4. Dashboard routes
5. User management routes
6. File upload routes
7. Less frequently used routes


📋 CHECKLIST FOR EACH ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Import proxyToBackend utility
☐ Remove old fetch code
☐ Add proxyToBackend call with correct path
☐ Set includeAuth appropriately
☐ Test route works
☐ Update API_MIGRATION_STATUS.md
☐ Commit changes


💡 TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Path should match backend route (/api/v2/reports → path: '/reports')
• Query params are automatically forwarded
• Request body is automatically included for POST/PUT/PATCH
• Auth token automatically added when includeAuth: true
• Response status codes are preserved
• Errors are handled consistently

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Happy migrating! 🚀

EOF
