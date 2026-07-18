import { NextRequest, NextResponse } from 'next/server';
import { proxy } from './locale-proxy';

export function middleware(request: NextRequest): NextResponse {
  const response = proxy(request);

  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.buymeacoffee.com https://client.crisp.chat; style-src 'self' 'unsafe-inline' https://client.crisp.chat; img-src 'self' data: blob: https://img.buymeacoffee.com https://cdn.buymeacoffee.com https://client.crisp.chat https://image.crisp.chat; connect-src 'self' ${apiUrl} https://api.tesla.com https://api.rollbar.com https://client.crisp.chat wss://client.relay.crisp.chat wss://stream.relay.crisp.chat; worker-src 'self' blob:; frame-src 'self' https://*.crisp.help https://www.buymeacoffee.com https://buymeacoffee.com; font-src 'self' https://client.crisp.chat; frame-ancestors 'none';`;

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: ['/', '/faq', '/en', '/fr', '/en/faq', '/fr/faq'],
};
