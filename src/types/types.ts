// FIX: Moved API call functions to services/geminiService.ts and defined/exported all necessary types.
export interface SeoResult {
  title: string;
  description: string;
  tags: string[];
}

export interface SocialPostCopy {
  headline: string;
  body: string;
  features: string[];
}

export interface SavedDesign {
  id: string;
  createdAt: string;
  type: 'thumbnail' | 'banner' | 'logo' | 'post' | 'shorts';
  imageUrl: string;
  prompt: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  priceUnit: string;
  features: string[];
  isFeatured: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar: string;
}