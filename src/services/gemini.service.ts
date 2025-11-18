// FIX: Added Type to imports and imported SeoResult type.
import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { SeoResult, SocialPostCopy } from "../types/types";

// FIX: Moved generateSeoContent from types.ts to centralize API calls.
export async function generateSeoContent(topic: string): Promise<SeoResult> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `You are an expert YouTube SEO and growth strategist. A user is creating a video about "${topic}". Your task is to generate a viral title, an SEO-optimized description, and relevant tags to maximize the video's reach and ranking.

  Follow these instructions precisely:
  1.  **Title:** Create a highly engaging, clickable, and SEO-friendly title. It should be under 70 characters and spark curiosity.
  2.  **Description:** Write a 2-3 paragraph description. The first two sentences must include the main keywords naturally. Structure it for readability with clear sections. Include 3-5 relevant hashtags at the end.
  3.  **Tags:** Provide a list of 10-15 relevant tags, including a mix of broad, specific, and long-tail keywords.

  Return the result as a JSON object. Do not include any other text or markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["title", "description", "tags"],
        },
      },
    });

    const jsonText = response?.text?.trim() || "";
    // In rare cases, the model might still wrap the JSON in markdown backticks
    const cleanedJsonText = jsonText?.replace(/^```json\s*|```$/g, "");

    if (!cleanedJsonText) {
      throw new Error("No valid response received from the model.");
    }

    const parsedResult = JSON.parse(cleanedJsonText);

    // Basic validation to ensure the result matches the expected structure
    if (
      parsedResult &&
      typeof parsedResult.title === "string" &&
      typeof parsedResult.description === "string" &&
      Array.isArray(parsedResult.tags)
    ) {
      return parsedResult;
    } else {
      throw new Error("Generated content does not match the expected format.");
    }
  } catch (error) {
    console.error("Error generating SEO content:", error);
    if (error instanceof Error && error.message.includes("billing")) {
      throw new Error(
        "Content generation failed. Please ensure billing is enabled for your API key."
      );
    }
    throw new Error(
      "Failed to generate SEO content. The model may have refused the request. Please try a different topic."
    );
  }
}

export async function generateSocialPostContent(
  topic: string
): Promise<SocialPostCopy> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `You are a world-class social media marketing copywriter. A user wants to create a promotional post about "${topic}". Your task is to generate compelling copy for the post.

  Follow these instructions precisely:
  1.  **Headline:** Create a short, punchy, and engaging headline (5-9 words).
  2.  **Body:** Write a persuasive body paragraph (1-2 sentences, 15-30 words total) that expands on the headline and provides value.
  3.  **Features:** Provide a list of 3-4 key features or benefits as short bullet points (6-10 words each).

  Return the result as a JSON object. Do not include any other text or markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: "A short, punchy, and engaging headline.",
            },
            body: {
              type: Type.STRING,
              description: "A persuasive body paragraph.",
            },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "A list of 3-4 key features or benefits as short bullet points.",
            },
          },
          required: ["headline", "body", "features"],
        },
      },
    });

    const jsonText = response?.text?.trim() || "";
    // In rare cases, the model might still wrap the JSON in markdown backticks
    const cleanedJsonText = jsonText?.replace(/^```json\s*|```$/g, "");

    if (!cleanedJsonText) {
      throw new Error("No valid response received from the model.");
    }

    const parsedResult = JSON.parse(cleanedJsonText);

    if (
      parsedResult &&
      typeof parsedResult.headline === "string" &&
      typeof parsedResult.body === "string" &&
      Array.isArray(parsedResult.features)
    ) {
      return parsedResult;
    } else {
      throw new Error(
        "Generated content does not match the expected format for social post copy."
      );
    }
  } catch (error) {
    console.error("Error generating social post content:", error);
    if (error instanceof Error && error.message.includes("billing")) {
      throw new Error(
        "Content generation failed. Please ensure billing is enabled for your API key."
      );
    }
    throw new Error(
      "Failed to generate social post content. The model may have refused the request. Please try a different topic."
    );
  }
}

export async function generateImage(
  prompt: string,
  aspectRatio: "16:9" | "1:1" | "9:16",
  inputImage?:
    | { data: string | undefined; mimeType: string | undefined }
    | undefined
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    if (inputImage) {
      // Use Gemini for image-in-image-out tasks
      const fullPromptWithAspectRatio = `${prompt}. The final output image MUST have a ${aspectRatio} aspect ratio.`;

      const imagePart = {
        inlineData: {
          mimeType: inputImage.mimeType,
          data: inputImage.data,
        },
      };
      const textPart = {
        text: fullPromptWithAspectRatio,
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      for (const part of response?.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
      throw new Error("No image was generated by the model.");
    } else {
      // Use Imagen for high-quality text-to-image tasks
      const response = await ai.models.generateImages({
        model: "imagen-4.0-generate-001",
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: aspectRatio,
        },
      });

      if (response?.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes =
          response?.generatedImages[0]?.image?.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        throw new Error("No image was generated.");
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error && error.message.includes("billing")) {
      throw new Error(
        "Image generation failed. Please ensure billing is enabled for your API key."
      );
    }
    throw new Error(
      "Failed to generate image. The model may have refused the request. Please try a different prompt."
    );
  }
}
