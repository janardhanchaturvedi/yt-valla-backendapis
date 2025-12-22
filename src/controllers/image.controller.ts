import { aiService } from "../services/ai.service";
import {
  generateChannelBannerSchema,
  generateImageSchema,
  generateSocialMediaPostSchema,
  generateThumbnailSchema,
  generateSEOSchema,
  generateChannelLogoSchema,
} from "../utils/validations";
import { authenticateRequest } from "../utils/http";
import type { RequestContext } from "../utils/http";
import {
  getCompositionInstructions,
  getFullPrompt,
} from "../prompts/thumbnailGeneration";
import {
  generateImage,
  generateSeoContentService,
} from "../services/gemini.service";
import { bannerGenerationPrompt } from "../prompts/bannerGeneration";
import { getSocialMediaPostPrompt } from "../prompts/socialMediaPostGeneration";
import { getShortsThumbnailPrompt } from "../prompts/shortsThumbnailGeneration";
import { uploadBase64Image } from "../utils/digitalocean-spaces";
import { logoGenerationPrompt } from "../prompts/logoGeneration";

export const generateThumbnailImage = async (ctx: RequestContext) => {
  try {
    // 1. Authenticate user
    const user = await authenticateRequest(ctx.request);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
    // 2. Validate incoming data
    const validatedData = generateThumbnailSchema.parse(ctx.body);

    // 3. Generate composition instructions
    const compositionInstruction = getCompositionInstructions({
      uploadedImage: validatedData.faceImageData?.data,
      isIncludeFace: validatedData.isFaceIncluded,
      mood: validatedData.mood,
    });

    // 4. Build the final full prompt
    const fullPrompt = getFullPrompt({
      title: validatedData.videoTitle,
      category: validatedData.channelCategory,
      style: validatedData.thumbnailStyle,
      mood: validatedData.mood,
      compositionInstruction,
    });

    // 5. Call your AI model to generate the thumbnail
    const image = await generateImage(
      fullPrompt,
      "16:9",
      validatedData.faceImageData // optional
    );

    // 6. Upload to DigitalOcean Spaces
    const imageUrl = await uploadBase64Image(
      image,
      `thumbnail-${Date.now()}.jpg`
    );

    // 7. Return the final response with the public URL
    return {
      success: true,
      data: {
        imageUrl,
        base64Image: image // Still include base64 if needed
      },
    };
  } catch (err: any) {
    console.error("Thumbnail Generation Error:", err);

    return {
      success: false,
      message: err?.message || "Something went wrong",
      status: err?.statusCode || 400,
    };
  }
};

export const generateChannelBanner = async (ctx: RequestContext) => {
  try {
    // 1. Authenticate user
    const user = await authenticateRequest(ctx.request);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
    // 2. Validate incoming data
    const validatedData = generateChannelBannerSchema.parse(ctx.body);
    const fullPrompt = bannerGenerationPrompt({
      channelName: validatedData.channelName,
      description: validatedData.channelDescription,
      tagline: validatedData.tagline,
      socialHandles: validatedData.socialHandles,
      uploadedImage: !!validatedData.uploadedImage,
    });
    console.log(fullPrompt);

    // 5. Call your AI model to generate the banner
    const image = await generateImage(
      fullPrompt,
      "16:9",
      validatedData.uploadedImage
    );

    // 6. Upload to DigitalOcean Spaces
    const imageUrl = await uploadBase64Image(
      image,
      `banner-${Date.now()}.jpg`
    );

    // 7. Return the final response with the public URL
    return {
      success: true,
      data: {
        imageUrl,
        base64Image: image // Still include base64 if needed
      },
    };
  } catch (err: any) {
    console.error("Banner Generation Error:", err);

    return {
      success: false,
      message: err?.message || "Something went wrong",
      status: err?.statusCode || 400,
    };
  }
};

export const generateLogo = async (ctx: RequestContext) => {
  try {
    // 1. Authenticate user
    const user = await authenticateRequest(ctx.request);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
    // 2. Validate incoming data
    const validatedData = generateChannelLogoSchema.parse(ctx.body);
    const fullPrompt = logoGenerationPrompt(validatedData.channelDescription);

    // 5. Call your AI model to generate the image
    const image = await generateImage(fullPrompt, "1:1");

    // 6. Upload to DigitalOcean Spaces
    const imageUrl = await uploadBase64Image(
      image,
      `logo-${Date.now()}.jpg`
    );

    // 7. Return the final response with the public URL
    return {
      success: true,
      data: {
        imageUrl,
        base64Image: image // Still include base64 if needed
      },
    };
  } catch (err: any) {
    console.error("Logo Generation Error:", err);

    return {
      success: false,
      message: err?.message || "Something went wrong",
      status: err?.statusCode || 400,
    };
  }
};

export const generateSocialMediaPosts = async (ctx: RequestContext) => {
  try {
    // 1. Authenticate user
    const user = await authenticateRequest(ctx.request);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
    // 2. Validate incoming data
    const validatedData = generateSocialMediaPostSchema.parse(ctx.body);
    const fullPrompt = getSocialMediaPostPrompt(validatedData.prompt);

    // 5. Call your AI model to generate the image
    const image = await generateImage(fullPrompt, "1:1");

    // 6. Upload to DigitalOcean Spaces
    const imageUrl = await uploadBase64Image(
      image,
      `post-${Date.now()}.jpg`
    );

    // 7. Return the final response with the public URL
    return {
      success: true,
      data: {
        imageUrl,
        base64Image: image // Still include base64 if needed
      },
    };
  } catch (err: any) {
    console.error("Social Post Generation Error:", err);

    return {
      success: false,
      message: err?.message || "Something went wrong",
      status: err?.statusCode || 400,
    };
  }
};

export const generateShortsThumbnails = async (ctx: RequestContext) => {
  try {
    // 1. Authenticate user
    const user = await authenticateRequest(ctx.request);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
    // 2. Validate incoming data
    const validatedData = generateSocialMediaPostSchema.parse(ctx.body);
    const fullPrompt = getShortsThumbnailPrompt(validatedData.prompt);

    // 5. Call your AI model to generate the image
    const image = await generateImage(fullPrompt, '9:16');

    // 6. Upload to DigitalOcean Spaces
    const imageUrl = await uploadBase64Image(
      image,
      `shorts-${Date.now()}.jpg`
    );

    // 7. Return the final response with the public URL
    return {
      success: true,
      data: {
        imageUrl,
        base64Image: image // Still include base64 if needed
      },
    };
  } catch (err: any) {
    console.log("err", err);
    console.error("Shorts Thumbnail Generation Error:", err);

    return {
      success: false,
      message: err?.message || "Something went wrong",
      status: err?.statusCode || 400,
    };
  }
};

export const generateSeoContent = async (ctx: RequestContext) => {
  try {
    const user = await authenticateRequest(ctx.request);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
    const validatedData = generateSEOSchema.parse(ctx.body);
    const seoResult = await generateSeoContentService(validatedData.videoTopic);
    return {
      success: true,
      data: seoResult,
    };
  } catch (err: any) {
    console.error("Seo Content Generation Error:", err);

    return {
      success: false,
      message: err?.message || "Something went wrong",
      status: err?.statusCode || 400,
    };
  }
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
      error: "Image ID is required",
    };
  }

  const image = await aiService.getImageById(ctx.params.id, user.userId);

  return {
    success: true,
    data: image,
  };
};
