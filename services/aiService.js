import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROMPTS } from '../utils/prompt.js';
import openai from '../config/openai.js';

const getPrompt = (userInput, type = 'main') => {
  if (type === 'enhance') return PROMPTS.ENHANCE_DESCRIPTION_PROMPT(userInput);
  return PROMPTS.MAIN_PROMPT(userInput);
};

export const getCompletionOpenAiConversation = async (userInput, type = 'main') => {
  try {
    const prompt = getPrompt(userInput, type);
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Prompt must be a non-empty string.");
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    const contentFromOpenAi = completion.choices[0]?.message?.content || "";
    const match = contentFromOpenAi.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const jsonStr = match ? match[1] : contentFromOpenAi;

    const parsed = JSON.parse(jsonStr.trim());
    return parsed || "No response";
  } catch (err) {
    console.error("OpenAI completion error:", err.message);
    return { error: "There was an error generating the AI response." };
  }
};

export const getCompletionGeminiAiConversation = async (userInput, type = 'main') => {
  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = getPrompt(userInput, type);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = await response.text();

    const match = rawText.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonStr = match ? match[1] : rawText;

    const parsed = JSON.parse(jsonStr.trim());
    return parsed;
  } catch (err) {
    console.error("Gemini completion error:", err.message);
    return {
      title: "AI Response",
      description: "There was an error enhancing the description. Please try again.",
    };
  }
};
