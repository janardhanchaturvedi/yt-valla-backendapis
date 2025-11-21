import { Router } from '../utils/router';
import { generateThumbnailImage, getUserImages, getImageById, generateChannelBanner, generateLogo, generateSocialMediaPosts, generateShortsThumbnails, generateSeoContent } from '../controllers/image.controller';

export const imageRoutes = new Router();

imageRoutes.post('/images/generate', generateThumbnailImage);
imageRoutes.post('/images/channel-banner', generateChannelBanner);
imageRoutes.post('/images/channel-logo', generateLogo);
imageRoutes.post('/images/social-media-posts', generateSocialMediaPosts);
imageRoutes.post('/images/shorts-thumbnails', generateShortsThumbnails);
imageRoutes.post('/images/seo-content', generateSeoContent);

imageRoutes.get('/images', getUserImages);

imageRoutes.get('/images/:id', getImageById);
