import { config } from './utils/config';
import { Router } from './utils/router';
import { jsonResponse, corsHeaders } from './utils/http';
import { authRoutes } from './routes/auth.routes';
import { creditRoutes } from './routes/credit.routes';
import { imageRoutes } from './routes/image.routes';

// Create main router
const router = new Router();

// Root routes
router.get('/', async () => ({
  success: true,
  message: 'YTVaala Backend API',
  version: '1.0.0',
}));

router.get('/health', async () => ({
  success: true,
  status: 'healthy',
  timestamp: new Date().toISOString(),
}));

// Combine all routes by forwarding to their handlers
async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle OPTIONS for CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  // Try each router in order
  if (path === '/' || path === '/health') {
    return router.handle(request);
  } else if (path.startsWith('/auth')) {
    return authRoutes.handle(request);
  } else if (path.startsWith('/credits')) {
    return creditRoutes.handle(request);
  } else if (path.startsWith('/images')) {
    return imageRoutes.handle(request);
  }

  // Not found
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

// Start Bun server
export const server = Bun.serve({
  port: config.port,
  fetch: handleRequest,
});

console.log(
  `🚀 YTVaala Backend is running at http://${server.hostname}:${server.port}`
);
