import type { Middleware } from "../utils/router";
import { jwt } from "../utils/jwt";

export const authMiddleware: Middleware = async (ctx, next) => {
  const auth = ctx.request.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Missing Authorization Token",
      }),
      { status: 401 }
    );
  }

  const tokenParts = auth.split(" ");
  const token = tokenParts[1];

  if (!token) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid authorization token format",
      }),
      { status: 401 }
    );
  }

  try {
    const decoded = await jwt.verify(token);

    if (!decoded) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid or expired token",
        }),
        { status: 401 }
      );
    }

    // Attach user to context for future middlewares/routes
    ctx.user = decoded;

    return next();
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid or expired token",
      }),
      { status: 401 }
    );
  }
};
