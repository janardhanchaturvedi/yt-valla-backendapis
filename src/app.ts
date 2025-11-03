import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { config } from './utils/config';
import { errorMiddleware } from './middlewares/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { creditRoutes } from './routes/credit.routes';
import { imageRoutes } from './routes/image.routes';

export const app = new Elysia()
  .use(cors())
  .use(errorMiddleware)
  .get('/', () => ({
    success: true,
    message: 'YTVaala Backend API',
    version: '1.0.0',
  }))
  .get('/health', () => ({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .use(authRoutes)
  .use(creditRoutes)
  .use(imageRoutes)
  .listen(config.port);

console.log(
  `🚀 YTVaala Backend is running at http://${app.server?.hostname}:${app.server?.port}`
);
