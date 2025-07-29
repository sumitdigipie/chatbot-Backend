import {
  getCompletionOpenAiConversation,
  getCompletionGeminiAiConversation,
} from '../services/aiService.js';

export const generateText = async (req, res) => {
  const { message: prompt, provider = 'gemini' } = req.body;
  console.log('Generate request received:', { prompt, provider });

  try {
    let result;
    if (provider === 'DeepSeek') {
      result = await getCompletionOpenAiConversation(prompt, 'main');
    } else if (provider === 'gemini') {
      result = await getCompletionGeminiAiConversation(prompt, 'main');
    } else {
      return res.status(400).json({ error: 'Invalid provider selected.' });
    }

    res.json({ from: provider, result });
  } catch (error) {
    console.error(`${provider} AI Generate Error:`, error.message || error);
    res.status(500).json({ error: 'Failed to generate text.' });
  }
};

export const enhanceText = async (req, res) => {
  const { message: prompt, provider = 'DeepSeek' } = req.body;

  console.log('Enhance request received:', { prompt, provider });

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt (message) is required and must be a string.' });
  }

  try {
    let result;
    if (provider === 'DeepSeek') {
      result = await getCompletionOpenAiConversation(prompt, 'enhance');
    } else if (provider === 'gemini') {
      result = await getCompletionGeminiAiConversation(prompt, 'enhance');
    } else {
      return res.status(400).json({ error: 'Invalid provider selected.' });
    }

    res.json({ from: provider, enhancedDescription: result.description || result });
  } catch (error) {
    console.error(`${provider} AI Enhance Error:`, error.message || error);
    res.status(500).json({ error: 'Failed to enhance text.' });
  }
};
