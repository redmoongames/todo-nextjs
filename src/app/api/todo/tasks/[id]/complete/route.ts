import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../../../ProxyUtils';

type Params = Promise<{ id: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = await params;
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${id}/complete/`, { method: 'POST' });
} 