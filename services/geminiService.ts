import { GoogleGenAI } from "@google/genai";
import { User } from "../types";

// Initialize the Gemini AI client
// NOTE: We assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateListingDescription = async (itemName: string, condition: string): Promise<string> => {
  if (!process.env.API_KEY) return "AI description unavailable (Missing API Key).";

  try {
    const prompt = `Write a short, catchy, and appealing sales description (max 40 words) for a used item to be sold on 'HostelHub Girls', a student marketplace app in Lahore.
    Item: ${itemName}
    Condition: ${condition}
    Target Audience: Female University Students.
    Tone: Friendly, honest, persuasive, sisterly.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};

export const analyzeRoommateCompatibility = async (user1: User, user2: User): Promise<string> => {
  if (!process.env.API_KEY) return "AI compatibility analysis unavailable.";

  try {
    const prompt = `Analyze the compatibility between these two female students as potential roommates in a girls' hostel.
    Student 1: ${JSON.stringify(user1)}
    Student 2: ${JSON.stringify(user2)}
    
    Provide a compatibility score out of 10 and a 2-sentence summary explaining why they match or clash. 
    Focus on habits (sleep schedule, cleanliness, noise) and shared interests suitable for female roommates.
    Output format: "Score: X/10. [Summary]"`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Could not analyze compatibility.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Compatibility check failed.";
  }
};

export const getHostelLifeAdvice = async (query: string): Promise<string> => {
  if (!process.env.API_KEY) return "AI advice unavailable.";

  try {
    const prompt = `You are a helpful 'Big Sister' advisor for female students in Lahore. Answer the following question about safety, girls' hostel life, saving money, or living in Lahore. Keep it short (max 50 words), empowering, and safe.
    Question: ${query}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "No advice available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not fetch advice.";
  }
};
