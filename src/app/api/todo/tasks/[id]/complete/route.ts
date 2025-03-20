import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../../../proxy-utils';

interface Params {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/todo/dashboards/1/todos/${params.id}/complete/`, { method: 'POST' });
} 