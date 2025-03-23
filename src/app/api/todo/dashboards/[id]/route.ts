import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../../ProxyUtils';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  console.log('[API ROUTE] getting dashboard', request);
  const { id } = await params;
  return proxyRequest(request, `/api/v1/todo/dashboards/${id}/`);
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  console.log('[API ROUTE] updating dashboard', request);
  const { id } = await params;
  return proxyRequest(request, `/api/v1/todo/dashboards/${id}/`);
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  console.log('[API ROUTE] deleting dashboard', request);
  const { id } = await params;
  return proxyRequest(request, `/api/v1/todo/dashboards/${id}/`);
} 