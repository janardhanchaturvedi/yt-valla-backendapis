import type { RequestContext } from './http';
import { parseBody, parseQuery, jsonResponse, errorResponse, corsHeaders } from './http';
import { AppError } from './errors';

export type RouteHandler = (ctx: RequestContext) => Promise<any> | any;

export interface Route {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
  paramNames: string[];
}

export class Router {
  public routes: Route[] = [];

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private parsePattern(pattern: string): { regex: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    // First escape all regex special characters except :param markers
    const regexPattern = pattern
      .replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return '___PARAM___'; // Placeholder
      })
      .split('/')
      .map(segment => segment === '___PARAM___' ? '([^/]+)' : this.escapeRegex(segment))
      .join('\\/');
    
    return {
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
    };
  }

  private addRoute(method: string, path: string, handler: RouteHandler) {
    const { regex, paramNames } = this.parsePattern(path);
    this.routes.push({
      method: method.toUpperCase(),
      pattern: regex,
      handler,
      paramNames,
    });
  }

  get(path: string, handler: RouteHandler) {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: RouteHandler) {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: RouteHandler) {
    this.addRoute('PUT', path, handler);
  }

  delete(path: string, handler: RouteHandler) {
    this.addRoute('DELETE', path, handler);
  }

  merge(router: Router) {
    this.routes.push(...router.routes);
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    const origin = request.headers.get('origin') || undefined;

    // Handle OPTIONS for CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
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
