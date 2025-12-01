export const getShortsThumbnailPrompt = (prompt: string) => {
  const fullPrompt = `You are an expert in creating viral YouTube Shorts content. Your task is to design an absolutely irresistible, scroll-stopping thumbnail for a Short about: "${prompt}". You have less than a second to grab the viewer's attention.

    **MISSION CRITICAL DIRECTIVES (NON-NEGOTIABLE):**
    1.  **EXTREME VISUAL IMPACT:** This is paramount. The image must be high-energy, high-contrast, and use hyper-saturated colors. Use dynamic angles and dramatic lighting. It must feel exciting.
    2.  **ONE. SINGLE. FOCAL. POINT:** Identify the single most compelling visual element and make it the hero. This could be a person with a jaw-dropped expression, a shocking object, or a satisfying pattern. Everything else is secondary.
    3.  **MANDATORY TEXT OVERLAY:** You MUST add text to this thumbnail. First, analyze the core subject of "${prompt}" and extract 1-3 of the most powerful, clickbait-style keywords. These keywords must then be rendered onto the image as HUGE, BOLD, GRAPHIC text. The text should have extreme contrast with the background (using outlines, glows, or solid blocks of color behind it) and be instantly readable on a phone screen. The text itself is a primary visual element.
    4.  **EMOTIONAL HOOK:** The design must evoke an immediate and powerful emotion: curiosity, shock, satisfaction, humor.
    
    **TECHNICAL REQUIREMENTS:**
    -   **ASPECT RATIO:** The final image MUST be in a vertical 9:16 aspect ratio. This is an absolute rule.
    
    **AVOID AT ALL COSTS:**
    -   Clutter. Simplicity is key.
    -   Small details or any text that isn't the main, huge keyword overlay.
    -   Multiple subjects or focal points.
    -   Dull colors or flat lighting.`;

  return fullPrompt;
};
