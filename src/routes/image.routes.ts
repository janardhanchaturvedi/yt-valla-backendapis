import { Router } from '../utils/router';
import { generateImage, getUserImages, getImageById } from '../controllers/image.controller';

export const imageRoutes = new Router();

imageRoutes.post('/images/generate', generateImage);

imageRoutes.get('/images', getUserImages);

imageRoutes.get('/images/:id', getImageById);
