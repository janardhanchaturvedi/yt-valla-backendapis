export const logoGenerationPrompt = (prompt: string) => {
  const fullPrompt = `You are a world-renowned brand identity designer, famous for creating clever, iconic, and minimalist logos. Your task is to design a complete logo (logomark + logotype) for a brand/channel named: "${prompt}". Your aesthetic is relentlessly modern and conceptually brilliant.

    **Part 1: The Logomark (The Symbol) - The Creative Core**

    1.  **Conceptual & Meaningful (This is the most important rule):** The logomark MUST be a clever, abstract symbol that is directly inspired by the brand's name and purpose: "${prompt}". It must visually communicate the essence of the brand.
        *   **Techniques to consider:**
            *   **Abstracted Initials:** Can you cleverly combine the initials of the brand (e.g., 'Y' and 'V' for 'YT Vaala') into a single, seamless, abstract mark?
            *   **Conceptual Symbolism:** Can you create an abstract symbol representing a key concept from the prompt (e.g., a play button, a camera lens, a spark of creativity)?
            *   **Negative Space:** Can you use negative space in a clever way to reveal a secondary shape or initial?
        *   **The goal is an "Aha!" moment:** A viewer should see a cool abstract shape first, and then realize it cleverly represents the brand. It must NOT be a literal icon.

    2.  **Unified & Simple:** The final mark must be a single, cohesive shape. Avoid creating multiple disconnected elements. It must be minimalist and instantly recognizable.

    3.  **Geometric Foundation:** Build the design using clean, geometric principles. It should feel balanced, deliberate, and professional.

    4.  **Masterful Color Theory:** Color is critical. You must select a sophisticated and modern color palette that emotionally aligns with the brand's essence ("${prompt}").
        *   **Choose a Professional Palette:** Select a harmonious combination. Here are some examples of modern palettes to inspire you:
            *   **Vibrant Tech:** Gradients of deep purple to electric blue to vibrant cyan.
            *   **Energetic & Creative:** Combinations like coral and teal, or magenta and orange.
            *   **Corporate & Trustworthy:** Palettes of deep navy blue, cool gray, and a single, strong accent color.
            *   **Premium & Elegant:** Palettes featuring dark charcoal, off-white, and a metallic accent like gold or silver.
        *   **Limited Colors:** Use no more than 3 colors. This is key to a clean, professional look.
        *   **Professional Gradients:** If using gradients, they must be smooth, subtle, and sophisticated. Avoid harsh, jarring transitions. The gradient should add depth, not create a cheap-looking effect.

    5.  **Vector-Style Finish:** The output must be a flawless, 2D vector-style graphic with sharp lines and smooth curves.

    **Part 2: The Logotype (The Text)**

    1.  **Content:** Use the brand name from the prompt: "${prompt}".
    2.  **Typography:** The font MUST be a clean, modern, professional sans-serif typeface. It should be perfectly legible and stylish. The font weight should be medium or semi-bold.
    3.  **Case & Spacing:** Use a consistent case (e.g., all lowercase, or Title Case). The letter-spacing (tracking) should be slightly increased for a more refined, airy look.
    4.  **Color:** The text should be a single, solid color—typically a dark charcoal gray for maximum readability, or a single dark, desaturated color pulled from the logomark's palette for harmony. It must have high contrast against the white background.

    **Part 3: The Lockup (Putting it together)**

    1.  **Layout:** The final logo should be a combination mark. The standard layout is the logomark centered above the logotype.
    2.  **Spacing & Alignment:** There should be a balanced amount of clear space between the mark and the text. Both elements must be perfectly centered horizontally.
    3.  **Presentation:** Present the final, complete logo on a plain, solid white background.

    **Strict Prohibitions (AVOID AT ALL COSTS):**
    *   NO random, meaningless abstract shapes. The mark MUST have a clear conceptual link to the prompt.
    *   NO composite icons (a box full of little pictures).
    *   NO literal or cartoonish illustrations.
    *   NO 3D effects, shadows, or glows (other than the approved subtle gradients).
    *   NO generic, default system fonts like Arial or Times New Roman for the logotype.`;

  return fullPrompt;
};