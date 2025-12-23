import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/reports/[id]/resolve
 * Resolve a report by creating a resolution record and updating report status to RESOLVED
 * 
 * Request body:
 * {
 *   resolutionType: 'RESOLVED' | 'ESCALATED' | 'DISMISSED' | 'TRANSFERRED',
 *   resolutionSummary: string,
 *   evidencePath?: string
 * }
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { id } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resolutionType, resolutionSummary, evidencePath } = body;

    // Validate required fields
    if (!resolutionType || !resolutionSummary) {
      return NextResponse.json(
        { error: 'Resolution type and summary are required' },
        { status: 400 }
      );
    }

    // Validate resolution type
    const validTypes = ['RESOLVED', 'ESCALATED', 'DISMISSED', 'TRANSFERRED'];
    if (!validTypes.includes(resolutionType)) {
      return NextResponse.json(
        { error: 'Invalid resolution type' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}/resolve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolutionType,
          resolutionSummary,
          evidencePath,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Resolve report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
