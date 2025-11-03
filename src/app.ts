import { config } from './utils/config';
import { Router } from './utils/router';
import { jsonResponse, corsHeaders } from './utils/http';
import { authRoutes } from './routes/auth.routes';
import { creditRoutes } from './routes/credit.routes';
import { imageRoutes } from './routes/image.routes';

// Create main router and register all routes
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

// Merge all route modules
router.merge(authRoutes);
router.merge(creditRoutes);
router.merge(imageRoutes);

// Start Bun server
export const server = Bun.serve({
  port: config.port,
  fetch: (request) => router.handle(request),
});

console.log(
  `🚀 YTVaala Backend is running at http://${server.hostname}:${server.port}`
);
