const fullPrompt = `You are a world-class social media designer and marketing expert. Your mission is to create a single, stunning, and highly professional promotional graphic for a social media post. The user's core idea for the post is: "${prompt}".

    **CRITICAL INSTRUCTIONS - FOLLOW THESE PRECISELY:**

    1.  **FINAL OUTPUT:** You must generate a single, complete image file. All text and graphics must be perfectly rendered *within* this image. This is a final, ready-to-post graphic.

    2.  **BACKGROUND IMAGE:**
        *   Create a visually captivating, professional, and high-quality background that is thematically related to "${prompt}".
        *   The background should be modern and clean. It can be an abstract tech-style graphic with glowing circuits, a professional photograph, or a clean graphic illustration. It must not be cluttered.
        *   Apply a prominent dark overlay or gradient to the background to ensure the text on top has maximum contrast and readability.

    3.  **TEXT CONTENT & HIERARCHY:**
        *   From the user's prompt, create a short, punchy, and engaging headline (5-9 words).
        *   Write a brief, persuasive body sentence (1-2 sentences) that explains the value.
        *   Create 3-4 short bullet points highlighting key features or benefits. Start each with a checkmark symbol (✓).
        *   **SPELLING & GRAMMAR:** All text MUST be spelled correctly in English. Double-check every word. There can be NO spelling errors or distorted letters.

    4.  **TYPOGRAPHY & LAYOUT (NON-NEGOTIABLE):**
        *   **FONT:** Use a modern, clean, bold, sans-serif font (like Inter, Poppins, or Helvetica Neue). The font choice must be professional and ultra-readable.
        *   **HIERARCHY:** Create strong visual hierarchy. The headline must be the largest and boldest text element. The body text should be smaller, and the bullet points smaller still.
        *   **READABILITY:** This is the #1 priority. Text must be perfectly legible with sharp edges. Use high contrast (e.g., white text on a darkened background). Add a subtle drop shadow to the text if needed to make it pop.
        *   **LAYOUT:** Arrange the text elements logically on the left side of the image, leaving space on the right for visual elements. Ensure there is ample padding around the text from the edges of the image.
        *   **Example Layout:**
            *   Headline at the top-left.
            *   Body text below the headline.
            *   A subtle dividing line.
            *   Bullet points at the bottom-left.

    5.  **TECHNICAL SPECIFICATIONS:**
        *   **Aspect Ratio:** The final image MUST be a 1:1 square aspect ratio.
        *   **AESTHETIC:** The overall feel must be premium, modern, and professional, suitable for a tech or marketing brand.

    **AVOID AT ALL COSTS:**
    *   Blurry, distorted, illegible, or misspelled text.
    *   Cluttered, messy layouts.
    *   Low-contrast text that is hard to read.
    *   Cartoonish or unprofessional fonts.`;

export const getSocialMediaPostPrompt = (prompt: string) => {
  return fullPrompt.replace("${prompt}", prompt);
};
