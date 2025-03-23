import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../../ProxyUtils';

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest, 
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${id}/`);
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${id}/`, { method: 'PUT' });
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${id}/`, { method: 'DELETE' });
} 