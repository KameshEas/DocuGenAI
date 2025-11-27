
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, Selections, Section, SelectableItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sectionSchema = {
    type: Type.OBJECT,
    properties: {
        sections: {
            type: Type.ARRAY,
            description: "List of documentation sections.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique, snake_case identifier for the section." },
                    label: { type: Type.STRING, description: "The user-facing title of the section." },
                    description: { type: Type.STRING, description: "A brief, one-sentence explanation of the section." }
                },
                 required: ["id", "label", "description"]
            }
        }
    },
    required: ["sections"]
};


export const suggestSections = async (idea: string): Promise<Section[]> => {
  const prompt = `Based on the following app idea, generate a comprehensive list of relevant documentation and planning sections. The idea is: "${idea}".

Return the response as a JSON object with a single key "sections". The value should be an array of objects. Each object must have "id", "label", and "description" string properties. Include standard sections like Project Overview, Core Features, and Database Schema, but also add 2-3 unique sections specifically tailored to the app idea. For example, for a "social media app for pet owners", you might add "Content Moderation Policy" or "Pet Profile Schema".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: sectionSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    return parsed.sections;
  } catch (error) {
    console.error("Error suggesting sections:", error);
    throw new Error("Failed to communicate with the AI to get section suggestions.");
  }
};

export const generateSectionContent = async (userInput: UserInput, section: Section | SelectableItem): Promise<string> => {
    const prompt = `
You are an expert software architect and product manager. Your task is to generate a detailed documentation section for an app idea.

**APP IDEA DETAILS:**
- **Core Idea:** ${userInput.idea}
- **Target Platform(s):** ${userInput.platform || 'Not specified'}
- **Intended Tech Stack:** ${userInput.techStack || 'Not specified'}
- **Developer Skill Level:** ${userInput.skillLevel || 'Not specified'}

---

**TASK:**
Generate content ONLY for the following section: "${section.label}".
${(section as Section).description ? `Description: ${(section as Section).description}` : ''}

**INSTRUCTIONS:**
- Format the output as Markdown.
- Start with a level 2 heading for the section title: "## ${section.label}".
- Provide detailed, actionable, and professional content.
- For code-related sections (like Database Schema or API Endpoints), provide clear code examples.
- For prompt packs, write high-quality, specific prompts that a developer could give to another AI to generate code. Each prompt should be in a code block.
- Ensure the final output is a single, coherent document starting with the section heading. DO NOT add any preamble or concluding remarks.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(`Error generating section "${section.label}":`, error);
        // Return a markdown-formatted error to be included in the document
        return `\n## ${section.label}\n\n> **Error:** An error occurred while generating this section. Please try again.`;
    }
};
