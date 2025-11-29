interface BannerPromptParams {
  channelName: string;
  description: string;
  tagline?: string;
  socialHandles?: string;
  uploadedImage?: boolean;
}

export const bannerGenerationPrompt = ({
  channelName,
  description,
  tagline,
  socialHandles,
  uploadedImage,
}: BannerPromptParams) => {
  let imageInstruction = "";
  if (uploadedImage) {
    imageInstruction = `
    **REFERENCE IMAGE INSTRUCTIONS:**
    The user has provided a custom image (e.g., a photo, logo, or mascot). You MUST integrate this into the banner.
    - **Blending:** Do not just "stick" it on top. Blend it naturally into the scene or frame it professionally.
    - **Position:** Place this image within the center "Safe Zone" alongside the text. If it is a portrait, place it to the left or right of the text. If it is a logo, center it or balance it with the channel name.
    - **Importance:** This image is a key part of the channel's brand identity. Make it look premium.`;
  }

  return `You are a world-class graphic designer specializing in YouTube Channel Art. Your task is to design a high-converting, 4K-quality channel banner for: "${channelName}".

    **PROJECT DETAILS:**
    *   **Channel Name:** "${channelName}"
    *   **Niche/Theme:** "${description}"
    *   **Tagline:** "${tagline || ""}"
    *   **Social Handles:** "${socialHandles || ""}"
    
    ${imageInstruction}

    **CRITICAL DESIGN RULES (LAYOUT):**
    YouTube banners are tricky. You MUST follow this layout to ensure the banner looks good on TV, Desktop, and Mobile.
    
    1.  **THE SAFE ZONE (CENTER):** All critical content—The Channel Name, Tagline, Social Handles, and key visual elements—MUST be strictly positioned in the horizontal and vertical center of the image.
    2.  **HIERARCHY:**
        *   **Primary:** The Channel Name "${channelName}" must be the largest, boldest, and most readable element. Use a modern, high-quality font.
        *   **Secondary:** The Tagline "${tagline}" (if present) should be smaller, placed below the name.
        *   **Tertiary:** The Social Handles "${socialHandles}" (if present) should be small, clean, and unobtrusive (e.g., at the bottom of the safe zone).
    3.  **BACKGROUND:** The background art should extend to the very edges of the 16:9 canvas (for TV viewers), but it should be abstract or atmospheric outside the center safe zone so nothing important is cut off on mobile.

    **AESTHETICS:**
    *   **Theme:** visual style must match: ${description}.
    *   **Quality:** Photorealistic, 3D render, or Vector Art (depending on niche). High contrast, sharp details.
    *   **Colors:** Use a professional palette that fits the niche.
    
    **OUTPUT REQUIREMENT:**
    *   **Resolution:** The image MUST be at least 2560x1440 pixels (YouTube Banner Standard).
    *   Generate a single, flat, 16:9 image.
    *   Ensure all text is spelled correctly.

    **NEGATIVE CONSTRAINTS (STRICT):**
    *   **NO TECHNICAL TEXT:** Do NOT include words like "Safe Zone", "Dimensions", "16:9", "2560x1440", or any measurement labels.
    *   **NO GUIDES:** Do NOT include any visible guide lines, rulers, or safe area boxes. The "Safe Zone" is a mental guide for placement, NOT a visual element.
    *   **NO PLACEHOLDERS:** Do not use placeholder text like "Your Name Here". Use the actual Channel Name provided.`;
};
