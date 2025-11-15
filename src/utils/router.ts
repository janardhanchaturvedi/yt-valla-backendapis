import type { RequestContext } from "./http";
import { parseBody, parseQuery, jsonResponse, errorResponse, corsHeaders } from "./http";
import { AppError } from "./errors";

export type RouteHandler = (ctx: RequestContext) => Promise<any> | any;

export type Middleware = (
  ctx: RequestContext,
  next: () => Promise<Response>
) => Promise<Response> | Response;

export interface Route {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
  middlewares: Middleware[];
  paramNames: string[];
  isPublic: boolean;
}

export class Router {
  public routes: Route[] = [];
  private globalMiddlewares: Middleware[] = [];

  /** Register global middleware */
  use(middleware: Middleware) {
    this.globalMiddlewares.push(middleware);
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /** Build regex pattern and extract params */
  private parsePattern(pattern: string): { regex: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const regexPattern = pattern
      .replace(/:[^/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return "___PARAM___";
      })
      .split("/")
      .map((segment) => (segment === "___PARAM___" ? "([^/]+)" : this.escapeRegex(segment)))
      .join("\\/");

    return {
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
    };
  }

  /** Internal route creation */
  private addRoute(
    method: string,
    path: string,
    handler: RouteHandler,
    middlewares: Middleware[] = [],
    isPublic = false
  ) {
    const { regex, paramNames } = this.parsePattern(path);

    this.routes.push({
      method: method.toUpperCase(),
      pattern: regex,
      handler,
      middlewares,
      paramNames,
      isPublic,
    });
  }

    /** Merge sub-router routes */
  merge(router: Router, prefix: string = "") {
    for (const route of router.routes) {
      const pattern = route.pattern.source
        .replace(/^\^/, "")
        .replace(/\$$/, "");

      const newPattern = new RegExp(`^${prefix}${pattern}$`);

      this.routes.push({
        ...route,
        pattern: newPattern
      });
    }
  }


  /* ------------------ PUBLIC ROUTES ------------------ */

  publicGet(path: string, handler: RouteHandler) {
    this.addRoute("GET", path, handler, [], true);
  }

  publicPost(path: string, handler: RouteHandler) {
    this.addRoute("POST", path, handler, [], true);
  }

  /* ------------------ PROTECTED ROUTES ------------------ */

  get(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute("GET", path, handler, middlewares, false);
  }

  post(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute("POST", path, handler, middlewares, false);
  }

  put(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute("PUT", path, handler, middlewares, false);
  }

  delete(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute("DELETE", path, handler, middlewares, false);
  }

  /* ------------------ GROUP ROUTING ------------------ */

  group(prefix: string, callback: (router: Router) => void, middlewares: Middleware[] = []) {
    const subRouter = new Router();

    // attach group-level middleware
    middlewares.forEach((m) => subRouter.use(m));

    callback(subRouter);

    for (const route of subRouter.routes) {
      const newPattern = new RegExp(
        `^${prefix}${route.pattern.source.replace(/^\^/, "").replace(/\$$/, "")}$`
      );

      this.routes.push({
        ...route,
        pattern: newPattern,
        middlewares: [...middlewares, ...route.middlewares],
      });
    }
  }

  /* ------------------ MIDDLEWARE PIPELINE ------------------ */

  private async runMiddlewares(
    middlewares: Middleware[],
    ctx: RequestContext,
    handler: () => Promise<Response>
  ): Promise<Response> {
    let idx = -1;

    const runner = async (i: number): Promise<Response> => {
      if (i <= idx) throw new Error("next() called twice");
      idx = i;

      const mw = middlewares[i];
      if (!mw) return handler();

      return mw(ctx, () => runner(i + 1));
    };

    return runner(0);
  }

  /* ------------------ HANDLE REQUEST ------------------ */

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get("origin") || undefined;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = path.match(route.pattern);
      if (!match) continue;

      try {
        const ctx: RequestContext = {
          request,
          params: {},
          query: parseQuery(url),
          body: await parseBody(request),
        };

        route.paramNames.forEach((name, index) => {
          ctx.params[name] = match[index + 1] || "";
        });

        // Public route → skip auth middleware only
        const effectiveMiddlewares = route.isPublic
          ? this.globalMiddlewares.filter((m: any) => !m.isAuth)
          : [...this.globalMiddlewares, ...route.middlewares];

        return await this.runMiddlewares(effectiveMiddlewares, ctx, async () => {
          const result = await route.handler(ctx);
          return jsonResponse(result);
        });
      } catch (error) {
        console.error("Router Error:", error);

        if (error instanceof AppError) {
          return errorResponse(error, error.statusCode);
        }

        return errorResponse(new Error("Internal Server Error"), 500);
      }
    }

    return jsonResponse(
      { success: false, error: { message: "Not found", statusCode: 404 } },
      404
    );
  }
}
