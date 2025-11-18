import { Router } from '../utils/router';
import { generateThumbnailImage, getUserImages, getImageById } from '../controllers/image.controller';

export const imageRoutes = new Router();

imageRoutes.post('/images/generate', generateThumbnailImage);

imageRoutes.get('/images', getUserImages);

imageRoutes.get('/images/:id', getImageById);
