import OpenAI from 'openai';
import Replicate from 'replicate';
import { config } from '../utils/config';
import { prisma } from '../utils/prisma';
import { creditService } from './credit.service';
import { storageService } from './storage.service';
import { BadRequestError } from '../utils/errors';
import type { GenerateImageInput } from '../utils/validations';

export class AIService {
  private openai: OpenAI;
  private replicate: Replicate;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.replicate = new Replicate({
      auth: config.replicate.apiKey,
    });
  }

  async generateImage(userId: string, data: GenerateImageInput) {
    const cost = data.provider === 'openai' ? config.openai.imageCost : config.replicate.imageCost;

    // Create image record with pending status
    const image = await prisma.image.create({
      data: {
        userId,
        prompt: data.prompt,
        imageUrl: '',
        provider: data.provider,
        cost,
        status: 'pending',
      },
    });

    try {
      // Deduct credits first
      await creditService.deductCredits(userId, cost, `Image generation via ${data.provider}`);

      let generatedImageUrl: string;

      if (data.provider === 'openai') {
        generatedImageUrl = await this.generateWithOpenAI(data.prompt);
      } else {
        generatedImageUrl = await this.generateWithReplicate(data.prompt);
      }

      // Upload to DigitalOcean Spaces
      // Determine file extension based on provider (both return PNG format)
      const fileExtension = 'png';
      const fileName = `${image.id}.${fileExtension}`;
      const uploadedUrl = await storageService.uploadFromUrl(generatedImageUrl, fileName);

      // Update image record
      const updatedImage = await prisma.image.update({
        where: { id: image.id },
        data: {
          imageUrl: uploadedUrl,
          status: 'completed',
        },
      });

      return updatedImage;
    } catch (error) {
      // Update image status to failed
      await prisma.image.update({
        where: { id: image.id },
        data: { status: 'failed' },
      });

      // If credits were deducted but generation failed, refund them
      try {
        await creditService.addCredits(userId, cost, `Refund for failed image generation`);
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError instanceof Error ? refundError.message : 'Unknown error');
      }

      throw new BadRequestError(
        error instanceof Error ? error.message : 'Image generation failed'
      );
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return imageUrl;
  }

  private async generateWithReplicate(prompt: string): Promise<string> {
    const output = await this.replicate.run(
      config.replicate.model as any,
      {
        input: {
          prompt,
          num_outputs: 1,
        },
      }
    );

    // Replicate returns an array of URLs
    const imageUrl = Array.isArray(output) ? output[0] : output;
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error('No image URL returned from Replicate');
    }

    return imageUrl;
  }

  async getUserImages(userId: string, limit: number = 50) {
    const images = await prisma.image.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return images;
  }

  async getImageById(imageId: string, userId: string) {
    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        userId,
      },
    });

    if (!image) {
      throw new BadRequestError('Image not found');
    }

    return image;
  }
}

export const aiService = new AIService();
