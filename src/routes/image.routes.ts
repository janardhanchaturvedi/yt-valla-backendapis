import { Router } from '../utils/router';
import { aiService } from '../services/ai.service';
import { generateImageSchema } from '../utils/validations';
import { authenticateRequest } from '../utils/http';

export const imageRoutes = new Router();

imageRoutes.post('/images/generate', async ({ request, body }) => {
  const user = await authenticateRequest(request);
  const validatedData = generateImageSchema.parse(body);
  const image = await aiService.generateImage(user.userId, validatedData);

  return {
    success: true,
    data: image,
  };
});

imageRoutes.get('/images', async ({ request, query }) => {
  const user = await authenticateRequest(request);
  const limit = query.limit ? parseInt(query.limit) : 50;
  const images = await aiService.getUserImages(user.userId, limit);

  return {
    success: true,
    data: images,
  };
});

imageRoutes.get('/images/:id', async ({ request, params }) => {
  const user = await authenticateRequest(request);
  const image = await aiService.getImageById(params.id, user.userId);

  return {
    success: true,
    data: image,
  };
});
