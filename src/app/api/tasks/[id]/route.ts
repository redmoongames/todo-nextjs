import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../ProxyUtils';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/tasks/${params.id}/`);
}

export async function PUT(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/tasks/${params.id}/`);
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/tasks/${params.id}/`);
}

export async function DELETE(request: NextRequest, { params }: Params): Promise<NextResponse> {
  return proxyRequest(request, `/api/v1/tasks/${params.id}/`);
} 