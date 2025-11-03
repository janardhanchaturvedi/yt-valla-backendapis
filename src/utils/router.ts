import type { RequestContext } from './http';
import { parseBody, parseQuery, jsonResponse, errorResponse, corsHeaders } from './http';
import { AppError } from './errors';

export type RouteHandler = (ctx: RequestContext) => Promise<any> | any;

export interface Route {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
  paramNames: string[];
  requiresAuth: boolean;
}

export class Router {
  private routes: Route[] = [];

  private parsePattern(pattern: string): { regex: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const regexPattern = pattern
      .replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');
    
    return {
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
    };
  }

  private addRoute(method: string, path: string, handler: RouteHandler, requiresAuth: boolean = false) {
    const { regex, paramNames } = this.parsePattern(path);
    this.routes.push({
      method: method.toUpperCase(),
      pattern: regex,
      handler,
      paramNames,
      requiresAuth,
    });
  }

  get(path: string, handler: RouteHandler, requiresAuth: boolean = false) {
    this.addRoute('GET', path, handler, requiresAuth);
  }

  post(path: string, handler: RouteHandler, requiresAuth: boolean = false) {
    this.addRoute('POST', path, handler, requiresAuth);
  }

  put(path: string, handler: RouteHandler, requiresAuth: boolean = false) {
    this.addRoute('PUT', path, handler, requiresAuth);
  }

  delete(path: string, handler: RouteHandler, requiresAuth: boolean = false) {
    this.addRoute('DELETE', path, handler, requiresAuth);
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    // Handle OPTIONS for CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Find matching route
    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = path.match(route.pattern);
      if (!match) continue;

      try {
        // Parse params
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        // Parse query and body
        const query = parseQuery(url);
        const body = await parseBody(request);

        // Create context
        const ctx: RequestContext = {
          request,
          params,
          query,
          body,
        };

        // Handle the route
        const result = await route.handler(ctx);
        return jsonResponse(result);
      } catch (error) {
        console.error('Error handling request:', error);
        
        if (error instanceof AppError) {
          return errorResponse(error, error.statusCode);
        }
        
        return errorResponse(
          error instanceof Error ? error : new Error('Unknown error'),
          500
        );
      }
    }

    // No route found
    return jsonResponse(
      {
        success: false,
        error: {
          message: 'Not found',
          code: 'NOT_FOUND',
          statusCode: 404,
        },
      },
      404
    );
  }
}
