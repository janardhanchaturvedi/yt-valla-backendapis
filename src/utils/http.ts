import { UnauthorizedError } from './errors';
import { jwt, type JWTPayload } from './jwt';

export interface RequestContext {
  request: Request;
  params: Record<string, string>;
  query: Record<string, string>;
  body?: any;
  user?: JWTPayload;
}

export async function parseBody(request: Request): Promise<any> {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    try {
      return await request.json();
    } catch {
      return null;
    }
  }
  
  return null;
}

export function parseQuery(url: URL): Record<string, string> {
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

export function parseBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization');
  if (!authorization) return null;
  
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export async function authenticateRequest(request: Request): Promise<JWTPayload> {
  const token = parseBearerToken(request);
  
  if (!token) {
    throw new UnauthorizedError('No authorization token provided');
  }
  
  const payload = await jwt.verify(token);
  
  if (!payload) {
    throw new UnauthorizedError('Invalid or expired token');
  }
  
  return payload;
}

import { config } from './config';

export function corsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = config.cors.allowedOrigins;
  
  // If specific origins are configured (not '*'), validate the origin
  let allowOrigin = allowedOrigins;
  if (allowedOrigins !== '*' && origin) {
    const allowed = allowedOrigins.split(',').map(o => o.trim());
    allowOrigin = allowed.includes(origin) ? origin : allowed[0] || '*';
  }
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

export function errorResponse(error: Error, status: number = 500): Response {
  return jsonResponse(
    {
      success: false,
      error: {
        message: error.message,
        code: (error as any).code || 'INTERNAL_SERVER_ERROR',
        statusCode: status,
      },
    },
    status
  );
}
