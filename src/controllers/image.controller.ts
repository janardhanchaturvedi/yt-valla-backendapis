import { aiService } from "../services/ai.service";
import {
  generateImageSchema,
  generateThumbnailSchema,
} from "../utils/validations";
import { authenticateRequest } from "../utils/http";
import type { RequestContext } from "../utils/http";
import {
  getCompositionInstructions,
  getFullPrompt,
} from "../prompts/thumbnailGeneration";
import { generateImage } from "../services/gemini.service";

// export const generateImage = async (ctx: RequestContext) => {
//   const user = await authenticateRequest(ctx.request);
//   const validatedData = generateImageSchema.parse(ctx.body);
//   const image = await aiService.generateImage(user.userId, validatedData);

//   return {
//     success: true,
//     data: image,
//   };
// };
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

    // 6. Return the final response
    return {
      success: true,
      data: image,
    };
  } catch (err: any) {
    console.error("Thumbnail Generation Error:", err);

    return {
      success: false,
      message: err?.message || "Something went wrong",
      status: 400,
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
