export const PROMPTS = {
  MAIN_PROMPT: (userInput) => `
You are given a user input that may or may not describe a bug, eature request, or issue** related to a software product.

Your task is to generate a task object in the following JSON format:
{
  "title": "A short, action-oriented task title (max 10 words)",
  "description": "A concise, detailed summary of the problem or request. Include the nature of the issue, steps to reproduce (if applicable), expected vs. actual behavior, affected components or features, and any relevant technical or environment context."
}

If the input is unclear or not related to a bug, feature request, or software issue, still respond with a JSON object. Use a generic title like "Clarify user request" and in the description, explain that the input does not appear to describe a valid software-related task and ask the user to rephrase or clarify.

Only respond with the JSON object.

User Input: ${userInput}
`
};