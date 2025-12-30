import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/announcements/${id}`,
    includeAuth: true,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('📤 Original body from frontend:', body);
    
    // 🔧 Transform for backend - dates stay as snake_case for controller processing
    const transformedBody: Record<string, any> = {};
    
    if (body.title) transformedBody.TITLE = body.title;
    if (body.message) transformedBody.MESSAGE = body.message;
    if (body.audience) transformedBody.AUDIENCE = body.audience;
    if (body.type) transformedBody.TYPE = body.type;
    if (body.priority) transformedBody.PRIORITY = body.priority;
    if (body.status) transformedBody.STATUS = body.status;
    if (body.photo_path !== undefined) transformedBody.PHOTO_PATH = body.photo_path;
    
    // Keep dates as snake_case so the controller can process them
    if (body.start_date) transformedBody.start_date = body.start_date;
    if (body.end_date) transformedBody.end_date = body.end_date;
    
    console.log('📤 Transformed body for backend:', transformedBody);
    
    return proxyToBackend(request, {
      path: `/announcements/${id}`,
      method: 'PUT',
      includeAuth: true,
      body: transformedBody,
    });
  } catch (error) {
    console.error('Error in PUT announcements route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update announcement',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/announcements/${id}`,
    method: 'DELETE',
    includeAuth: true,
  });
}