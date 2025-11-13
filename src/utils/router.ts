import type { RequestContext } from './http';
import { parseBody, parseQuery, jsonResponse, errorResponse, corsHeaders } from './http';
import { AppError } from './errors';

export type RouteHandler = (ctx: RequestContext) => Promise<any> | any;
export type Middleware = (ctx: RequestContext, next: () => Promise<Response>) => Promise<Response> | Response;

export interface Route {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
  middleware?: Middleware[];
  paramNames: string[];
}

export class Router {
  public routes: Route[] = [];
  private middlewares: Middleware[] = [];

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private parsePattern(pattern: string): { regex: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const regexPattern = pattern
      .replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return '___PARAM___';
      })
      .split('/')
      .map(segment => segment === '___PARAM___' ? '([^/]+)' : this.escapeRegex(segment))
      .join('\\/');

    return {
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
    };
  }

  private addRoute(method: string, path: string, handler: RouteHandler, middleware?: Middleware[]) {
    const { regex, paramNames } = this.parsePattern(path);
    this.routes.push({
      method: method.toUpperCase(),
      pattern: regex,
      handler,
      middleware,
      paramNames,
    });
  }

  get(path: string, handler: RouteHandler, middleware?: Middleware[]) {
    this.addRoute('GET', path, handler, middleware);
  }

  post(path: string, handler: RouteHandler, middleware?: Middleware[]) {
    this.addRoute('POST', path, handler, middleware);
  }

  put(path: string, handler: RouteHandler, middleware?: Middleware[]) {
    this.addRoute('PUT', path, handler, middleware);
  }

  delete(path: string, handler: RouteHandler, middleware?: Middleware[]) {
    this.addRoute('DELETE', path, handler, middleware);
  }

  merge(router: Router, prefix: string = '') {
    for (const route of router.routes) {
      const prefixedPattern = prefix + route.pattern.source.replace(/^(\^)?/, '^' + prefix);
      this.routes.push({
        ...route,
        pattern: new RegExp(prefixedPattern),
      });
    }
  }

  /** ✅ Group-based routing */
  group(prefix: string, callback: (router: Router) => void) {
    const subRouter = new Router();
    callback(subRouter);
    // Merge with prefix
    for (const route of subRouter.routes) {
      const prefixedPath = `${prefix}${route.pattern.source.replace(/^\^/, '').replace(/\$$/, '')}`;
      const newPattern = new RegExp(`^${prefixedPath}$`);
      this.routes.push({
        ...route,
        pattern: newPattern,
      });
    }
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    const origin = request.headers.get('origin') || undefined;

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    for (const route of this.routes) {
      if (route.method !== method) continue;
      const match = path.match(route.pattern);
      if (!match) continue;

      try {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1] || '';
        });

        const query = parseQuery(url);
        const body = await parseBody(request);

        const ctx: RequestContext = {
          request,
          params,
          query,
          body,
        };

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
