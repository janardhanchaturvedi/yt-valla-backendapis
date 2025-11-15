import { config } from './utils/config';
import { Router } from './utils/router';
import { authRoutes } from './routes/auth.routes';
import { creditRoutes } from './routes/credit.routes';
import { imageRoutes } from './routes/image.routes';

const router = new Router();

// Public root route
router.publicGet('/', async () => ({
  success: true,
  message: 'YTVaala Backend API',
  version: '1.0.0',
}));

router.group('/api/v1', (api) => {
  
  // Public: health should NOT require auth
  api.publicGet('/health', async () => ({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }));

  // Merge your routes (using new router)
  api.merge(authRoutes);
  api.merge(creditRoutes);
  api.merge(imageRoutes);
});

// Start server
export const server = Bun.serve({
  port: config.port,
  fetch: (request) => router.handle(request),
});

console.log(`🚀 YTVaala Backend is running at http://${server.hostname}:${server.port}`);
