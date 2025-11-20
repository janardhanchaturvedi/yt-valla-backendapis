const fullPrompt = `You are a professional YouTube channel branding expert. Your task is to design a stunning, high-resolution channel banner for a channel whose content is about: "${prompt}".

    **Core Directives:**
    1.  **Channel Identity:** The banner must visually represent the core theme and identity of the channel: "${prompt}".
    2.  **Centralized Design (Safe Zone):** This is CRITICAL. All key elements—including text, logos, and important visuals—MUST be placed within the central "safe area" so they are visible on all devices. The areas outside this central zone should contain complementary background graphics that can be safely cropped.
    3.  **Visuals & Imagery:** Create a compelling, high-quality visual that is relevant to the channel's content. It should be clean and professional, not cluttered.
    4.  **Text/Typography:** If you include text, like the channel name or a tagline, it must be modern, clean, and highly legible. It should complement the overall aesthetic.
    5.  **Color Palette:** Use a professional and cohesive color scheme that matches the channel's mood and topic.

    **Non-Negotiable Technical Requirements:**
    -   **Aspect Ratio:** The final image MUST be a 16:9 landscape aspect ratio.
    -   **High Resolution Look:** The design should look sharp and high-quality.

    **AVOID AT ALL COSTS:**
    -   Placing important information outside the central safe area.
    -   A cluttered or busy design.
    -   Illegible or low-contrast text.`;
export const bannerGenerationPrompt = (prompt: string) =>
  fullPrompt.replace("${prompt}", prompt);
