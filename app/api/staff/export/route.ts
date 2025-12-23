import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/staff/export
 * Export staff list to CSV or Excel
 * Query params: format (csv|xlsx), department, role
 */

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    
    if (!['csv', 'xlsx'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Use csv or xlsx' },
        { status: 400 }
      );
    }

    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/staff/export?${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // Forward the file response
    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'text/csv';
    const contentDisposition = response.headers.get('content-disposition') || 
      `attachment; filename="staff-export.${format}"`;

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error) {
    console.error('Export staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
