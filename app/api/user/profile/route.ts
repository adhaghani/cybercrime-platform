import { NextRequest, NextResponse } from "next/server";

/**
 * User Profile API Route
 * TODO: Implement with Oracle backend when auth endpoints are ready
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint is not yet implemented. Use GET /api/accounts/:id from the Oracle backend.",
      message: "Endpoint pending backend integration"
    },
    { status: 501 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint is not yet implemented. Use PUT /api/accounts/:id from the Oracle backend.",
      message: "Endpoint pending backend integration"
    },
    { status: 501 }
  );
}
