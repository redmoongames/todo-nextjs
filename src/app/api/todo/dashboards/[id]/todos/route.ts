import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../../../ProxyUtils';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  console.log('[API ROUTE] getting todos for dashboard', id);
  return proxyRequest(request, `/api/v1/todo/dashboards/${id}/todos/`);
}

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  console.log('[API ROUTE] creating todo for dashboard', id);
  return proxyRequest(request, `/api/v1/todo/dashboards/${id}/todos/`);
}
