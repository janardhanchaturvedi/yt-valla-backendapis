import { aiService } from '../services/ai.service';
import { generateImageSchema } from '../utils/validations';
import { authenticateRequest } from '../utils/http';
import type { RequestContext } from '../utils/http';

export const generateImage = async (ctx: RequestContext) => {
  const user = await authenticateRequest(ctx.request);
  const validatedData = generateImageSchema.parse(ctx.body);
  const image = await aiService.generateImage(user.userId, validatedData);

  return {
    success: true,
    data: image,
  };
};

export const getUserImages = async (ctx: RequestContext) => {
  const user = await authenticateRequest(ctx.request);
  const limit = ctx.query.limit ? parseInt(ctx.query.limit) : 50;
  const images = await aiService.getUserImages(user.userId, limit);

  return {
    success: true,
    data: images,
  };
};

export const getImageById = async (ctx: RequestContext) => {
  const user = await authenticateRequest(ctx.request);
  
  if (!ctx.params?.id) {
    return {
      success: false,
      error: 'Image ID is required',
    };
  }

  const image = await aiService.getImageById(ctx.params.id, user.userId);

  return {
    success: true,
    data: image,
  };
};
