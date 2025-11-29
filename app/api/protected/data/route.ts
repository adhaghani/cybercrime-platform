import { NextRequest, NextResponse } from "next/server";

/**
 * Protected Data API Route
 * TODO: Implement with Oracle backend when auth endpoints are ready
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint is not yet implemented. Please use the Oracle backend API directly.",
      message: "Endpoint pending backend integration"
    },
    { status: 501 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint is not yet implemented. Please use the Oracle backend API directly.",
      message: "Endpoint pending backend integration"
    },
    { status: 501 }
  );
}
