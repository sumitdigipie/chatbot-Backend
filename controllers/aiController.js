import { getCompletionOpenAiConversation, getCompletionGeminiAiConversation } from '../services/aiService.js';

export const generateText = async (req, res) => {
  const { message: prompt, provider = 'gemini' } = req.body;
  console.log('Request received:', { prompt, provider });

  try {
    let result;
    if (provider === 'DeepSeek') {
      result = await getCompletionOpenAiConversation(prompt);
    } else if (provider === 'gemini') {
      result = await getCompletionGeminiAiConversation(prompt);
    } else {
      return res.status(400).json({ error: 'Invalid provider selected.' });
    }

    res.json({ from: "AI", result });
  } catch (error) {
    console.error(`${provider} Error:`, error.message || error);
    res.status(500).json({ error: 'Failed to generate text.' });
  }
};

