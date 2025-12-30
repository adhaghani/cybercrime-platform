import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * PUT /api/reports/bulk-update-status
 * Update status for multiple reports at once
 * Body: { ids: string[], status: ReportStatus }
 */

export async function PUT(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/bulk-update-status',
    method: 'PUT',
    includeAuth: true,
  });
}
  } catch (error) {
    console.error('Bulk update report status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
