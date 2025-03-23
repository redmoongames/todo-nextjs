import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../ProxyUtils';

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/tasks/${id}/`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/tasks/${id}/`);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/tasks/${id}/`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/tasks/${id}/`);
} 