import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../ProxyUtils';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return proxyRequest(request, '/api/v1/todo/dashboards/1/todos/');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return proxyRequest(request, '/api/v1/todo/dashboards/1/todos/', { method: 'POST' });
} 