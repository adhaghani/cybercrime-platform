import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/**
 * Email Confirmation Route
 * TODO: Implement with Oracle backend when auth endpoints are ready
 */
export async function GET(request: NextRequest) {
  // For now, redirect to error page
  // This will be implemented when backend email verification is ready
  redirect("/auth/error?error=Email confirmation not yet implemented");
}
