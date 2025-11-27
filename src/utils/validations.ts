import { z } from "zod";

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Image Generation Schemas
export const generateImageSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  provider: z.enum(["openai", "replicate", "gemini"]).default("gemini"),
});

export const generateThumbnailSchema = z
  .object({
    videoTitle: z.string().min(10).max(120),
    channelCategory: z.enum([
      "tech",
      "vlogging",
      "education",
      "cooking",
      "lifestyle",
      "gaming",
    ]),
    thumbnailStyle: z.enum(["bold", "minimalist", "cartoon", "photo"]),
    mood: z.enum(["excited", "serious", "educational", "funny", "mysterious"]),
    isFaceIncluded: z.boolean(),
    faceImageData: z
      .object({
        data: z
          .string()
          .regex(/^data:image\/\w+;base64,/, "Invalid image base64"),

        mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      })
      .optional(),
  })
  .refine(
    (values) => {
      if (values.isFaceIncluded) {
        return !!values.faceImageData;
      }
      return true;
    },
    {
      message: "Face image data is required when isFaceIncluded is true",
      path: ["faceImageData"],
    }
  );

export const generateChannelBannerSchema = z.object({
  channelDescription: z.string().min(10).max(120),
});

export const generateChannelLogoSchema = z.object({
  channelDescription: z.string().min(10).max(120),
});
export const generateSocialMediaPostSchema = z.object({
  prompt: z.string().min(10).max(120),
});

export const generateShortsThumbnailsSchema = z.object({
  prompt: z.string().min(10).max(120),
});
export const generateSEOSchema = z.object({
  videoTopic: z.string().min(10).max(120),
});
// Credit Transaction Schemas
export const addCreditsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  amount: z.number().int().positive("Amount must be positive"),
  description: z.string().optional().default("Credit added"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type AddCreditsInput = z.infer<typeof addCreditsSchema>;
