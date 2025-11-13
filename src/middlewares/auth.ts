import type { Middleware } from "../utils/router";
import jwt from "jsonwebtoken";

export const authMiddleware: Middleware = async (ctx, next) => {
  const auth = ctx.request.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response(JSON.stringify({
      success: false,
      message: "Missing Authorization Token"
    }), { status: 401 });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Attach user to context for future middlewares/routes
    ctx.user = decoded;

    return next();
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      message: "Invalid or expired token"
    }), { status: 401 });
  }
};
