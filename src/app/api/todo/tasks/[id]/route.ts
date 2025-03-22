import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../../ProxyUtils';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${params.id}/`);
}

export async function PUT(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${params.id}/`, { method: 'PUT' });
}

export async function DELETE(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${params.id}/`, { method: 'DELETE' });
} 