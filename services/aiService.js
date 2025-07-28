import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROMPTS } from '../utils/prompt.js';
import openai from '../config/openai.js';

export const getCompletionOpenAiConversation = async (userInput) => {
  try {
    const prompt = PROMPTS.MAIN_PROMPT(userInput)
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Prompt must be a non-empty string.");
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
    });

    const contentFromOpenAi = completion.choices[0]?.message?.content || "";
    const match = contentFromOpenAi.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const jsonStr = match ? match[1] : contentFromOpenAi;
    const parsed = JSON.parse(jsonStr.trim());

    return parsed || "No response";
  } catch (err) {
    console.error("OpenAI completion error:", err.message);
    return "There was an error generating the AI response.";
  }
};

export const getCompletionGeminiAiConversation = async (userInput) => {
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = PROMPTS.MAIN_PROMPT(userInput)

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = await response.text();

  try {
    const match = rawText.match(/```json\s*([\s\S]*?)\s*```/i);

    const jsonStr = match ? match[1] : rawText;

    const parsed = JSON.parse(jsonStr.trim());
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON response:", err.message);
    return {
      title: "AI Response",
      description: rawText
    };
  }
};
