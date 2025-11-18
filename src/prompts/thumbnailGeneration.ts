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
    return `The user has provided an image. This image is the HERO of the thumbnail. Masterfully integrate this subject into a new, dynamic background. Enhance it with dramatic lighting, effects, and color grading to match the overall '${mood}' mood. The subject must be the undeniable focal point.`;
  }

  if (isIncludeFace) {
    return `This thumbnail MUST feature a hyper-expressive, AI-generated human face. The face should be the main focal point, conveying a powerful and exaggerated '${mood}' emotion that is instantly readable.`;
  }

  return `This thumbnail must be conceptual and object-focused. DO NOT include a human face. Instead, create a powerful, symbolic image using objects, graphics, or a scene that brilliantly represents the video's core idea.`;
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
  return `
You are a world-class YouTube thumbnail designer, a master of visual psychology and click-through-rate (CTR) optimization.

Your task is to create a viral thumbnail for a video titled: **"${title}"**.

---

### ⭐ CORE DIRECTIVES

1. **Video Topic:** "${title}"

2. **Channel Category & Style:**  
   The aesthetic is **'${category}'**, which means:  
   ${categoryStyles[category]}  
   The overall artistic style you must follow is **'${style}'**.

3. **Composition:**  
   ${compositionInstruction}  
   Apply the rule of thirds. Create a single, unmissable focal point.  
   The design must be clean and never cluttered.

4. **Color & Lighting:**  
   Use a high-contrast, vibrant color palette that *pops*.  
   Employ dramatic lighting such as rim lighting, glow edges, or cinematic contrast.

5. **Text Guidelines:**  
   If text is included:  
   - It must be **HUGE**, **BOLD**, and extremely high contrast.  
   - Use **max 3–4 powerful words** only.  
   - Use clean, modern, ultra-readable fonts.  
   - Add outlines or drop shadows for instant visibility.

6. **Background:**  
   The background must be **dynamic and relevant**, adding depth without distracting.  
   No plain flat backgrounds unless stylistically intentional.

---

### ⚙️ NON-NEGOTIABLE TECHNICAL REQUIREMENTS

- **Aspect Ratio:** Strict **16:9 landscape**.  
- **Mobile Clarity:** Must remain readable and compelling even at **tiny mobile sizes**.  
- **High CTR Focus:** The design must instantly communicate the video’s hook.

---

### ❌ AVOID AT ALL COSTS

- Clutter or too many elements  
- Low contrast or small text  
- Flat, boring lighting  
- Weak focal points  
- Anything that fails to scream **"CLICK ME!"**

---
  `.trim();
}

export { categoryStyles };
