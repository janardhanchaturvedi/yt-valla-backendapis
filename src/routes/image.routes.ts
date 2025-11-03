import { Elysia, t } from 'elysia';
import { aiService } from '../services/ai.service';
import { generateImageSchema } from '../utils/validations';
import { authMiddleware } from '../middlewares/auth.middleware';

export const imageRoutes = new Elysia({ prefix: '/images' })
  .use(authMiddleware)
  .post(
    '/generate',
    async ({ user, body }) => {
      const validatedData = generateImageSchema.parse(body);
      const image = await aiService.generateImage(user.id, validatedData);

      return {
        success: true,
        data: image,
      };
    },
    {
      body: t.Object({
        prompt: t.String(),
        provider: t.Optional(t.Union([t.Literal('openai'), t.Literal('replicate')])),
      }),
    }
  )
  .get('/', async ({ user, query }) => {
    const limit = query.limit ? parseInt(query.limit) : 50;
    const images = await aiService.getUserImages(user.id, limit);

    return {
      success: true,
      data: images,
    };
  })
  .get('/:id', async ({ user, params }) => {
    const image = await aiService.getImageById(params.id, user.id);

    return {
      success: true,
      data: image,
    };
  });
