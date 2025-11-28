const categoryStyles = {
  tech: "sleek, modern, and clean aesthetic with a futuristic feel. Use a color palette of blues, blacks, and whites with high-tech fonts.",
  vlogging:
    "personal, authentic, and engaging style. Use bright, natural colors and friendly, legible fonts. Often features a person's face with a clear expression.",
  gaming:
    "dynamic, high-energy, and exciting style. Use vibrant, contrasting colors, dramatic fonts, and elements from the game itself.",
  education:
    "clear, informative, and professional style. Use a clean layout, easy-to-read fonts, and graphics that help explain the topic.",
  cooking:
    "warm, delicious, and inviting style. Use rich, appetizing colors, elegant or rustic fonts, and high-quality images of food.",
  lifestyle:
    "aspirational, clean, and aesthetically pleasing style. Use soft, trendy color palettes, stylish fonts, and high-quality photography.",
};
interface CompositionInterfaceProps {
  uploadedImage?: string;
  isIncludeFace?: boolean;
  mood?: string;
}

export function getCompositionInstructions({
  uploadedImage,
  isIncludeFace,
  mood = "neutral",
}: CompositionInterfaceProps) {
  if (uploadedImage) {
    return `
        **INPUT IMAGE HANDLING (CRITICAL):** 
        The user has provided a reference image (e.g., their face, a product, or a logo). 
        1. **INTEGRATION:** You MUST use this uploaded image as the main subject/focal point. 
        2. **ASPECT RATIO CORRECTION:** The input image might be square or portrait. You MUST place this subject into a completely new, wide 16:9 landscape composition.
        3. **DO NOT STRETCH:** Do not distort or stretch the subject to fit. Instead, generate a new background that extends naturally to fill the 1920x1080 frame.
        4. **BLENDING:** Blend the subject professionally into the scene with matching lighting and shadows.
        `.trim();
  } else if (isIncludeFace) {
    return `
        **SUBJECT:** The thumbnail MUST feature a high-quality, hyper-expressive AI-generated human face. 
        The face should be looking at the camera or the object of interest. The expression must clearly convey '${mood}'.
        `.trim();
  } else {
    return `
        **SUBJECT:** This thumbnail must be conceptual and object-focused. DO NOT include a human face. 
        Create a powerful, symbolic image using objects, graphics, or a scene that represents the video's core idea.
        `.trim();
  }
}

interface ThumbnailPromptParams {
  title: string;
  category: keyof typeof categoryStyles;
  style: string;
  mood: string;
  compositionInstruction: string;
}

export function getFullPrompt({
  title,
  category,
  style,
  mood,
  compositionInstruction,
}: ThumbnailPromptParams) {
  return `You are a world-class YouTube thumbnail designer known for high CTR (Click-Through Rate). Your task is to design a viral thumbnail for a video titled: "${title}".

    **Design Specs:**
    *   **Video Title:** "${title}"
    *   **Category:** ${category} (${categoryStyles[category]})
    *   **Style:** ${style}
    *   **Mood:** ${mood}
    
    ${compositionInstruction}

    **Composition Rules (16:9 Canvas):**
    1.  **Layout:** Use the Rule of Thirds. The main subject should be prominent but balanced.
    2.  **Background:** Create a depth-filled, dynamic background that screams "High Production Value". Avoid plain colors.
    3.  **Text:** Use HUGE, BOLD, IMPACTFUL typography. Keep it short (2-4 words max) to complement the title. Ensure extreme contrast against the background.
    4.  **Lighting:** Use dramatic, cinematic lighting (rim lights, glow effects) to separate the subject from the background.
    5.  **Colors:** Use a ${category === "gaming" ? "neon and high-contrast" : category === "cooking" ? "warm and appetizing" : "professional and vibrant"} color palette.

    **Technical Output:**
    *   **Resolution:** 1920x1080 (Full HD).
    *   **Aspect Ratio:** STRICTLY 16:9 Landscape.
    *   **Quality:** 4K, highly detailed, sharp focus. No blurring or artifacts.
    `.trim();
}

export { categoryStyles };
