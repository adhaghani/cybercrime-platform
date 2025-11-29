import { NextResponse } from "next/server";

/**
 * OAuth Callback Route
 * TODO: Implement with Oracle backend when OAuth providers are configured
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  
  // For now, redirect to error page
  // This will be implemented when backend OAuth is ready
  return NextResponse.redirect(`${origin}/auth/error?error=OAuth not yet implemented`);
}
