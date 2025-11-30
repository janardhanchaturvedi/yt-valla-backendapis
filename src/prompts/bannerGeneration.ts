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
}: BannerPromptParams) => {
  const imageInstruction = `
      **INPUT IMAGE IS A WIREFRAME LAYOUT:** 
      - The provided image establishes the **MANDATORY POSITIONING** of text and logos. Do NOT move them.
      - **YOUR GOAL:** Completely RE-RENDER the scene. The white text in the draft is just a placeholder. Turn it into **High-End 3D Typography**.
      
      **VISUAL STYLE INSTRUCTIONS (Make it Attractive):**
      1.  **3D Texturing:** The Channel Name ("${channelName}") should look like a physical object in the scene. Use materials like **Brushed Metal, Neon Glass, Polished Gold, or Distressed Stone** depending on the theme.
      2.  **Lighting:** Use cinematic lighting (Rim lights, volumetric fog, lens flares). The text should cast shadows or reflect the environment.
      3.  **Background:** Replace the dark grey background with a **rich, detailed environment**. 
          - If Tech: A futuristic server room or abstract circuit board with depth of field.
          - If Gaming: A dynamic cyber-arena with sparks and energy.
          - If Vlog/Lifestyle: A soft, bokeh-filled studio background with warm lighting.
      4.  **Composition:** Keep the center "Safe Zone" clear and readable, but fill the edges (the sides of the banner) with interesting details.
      
      **THEME CONTEXT:**
      - **Niche/Description:** "${description}"
      - **Vibe:** Professional, High-Budget, Viral.
      `;

  const fullPrompt = `You are a world-class Visual Designer. Create a 2560x1440 YouTube Banner.
      
      ${imageInstruction}
      
      **FINAL POLISH:**
      - The output must look like a finalized render from Octane or Unreal Engine 5.
      - Sharp details, 8k resolution textures.
      - No flat colors. Everything must have depth.
      `;

  return fullPrompt;
};
