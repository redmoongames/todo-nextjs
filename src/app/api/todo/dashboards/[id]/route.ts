import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../../ProxyUtils';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.log('[API ROUTE] getting dashboard', request);
  console.log('Dashboard ID:', params.id);
  
  return proxyRequest(request, `/api/v1/todo/dashboards/${params.id}/`);
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.log('[API ROUTE] updating dashboard', request);
  console.log('Dashboard ID:', params.id);
  
  return proxyRequest(request, `/api/v1/todo/dashboards/${params.id}/`);
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.log('[API ROUTE] deleting dashboard', request);
  console.log('Dashboard ID:', params.id);
  
  return proxyRequest(request, `/api/v1/todo/dashboards/${params.id}/`);
} 