import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Image Generation Schemas
export const generateImageSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt is too long'),
  provider: z.enum(['openai', 'replicate']).default('openai'),
});

// Credit Transaction Schemas
export const addCreditsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  amount: z.number().int().positive('Amount must be positive'),
  description: z.string().optional().default('Credit added'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type AddCreditsInput = z.infer<typeof addCreditsSchema>;
