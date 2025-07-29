export const PROMPTS = {
  MAIN_PROMPT: (userInput) => `
You are given a user input that may or may not describe a bug, feature request, or issue related to a software product.

Your task is to generate a task object in the following JSON format:
{
  "title": "A short, action-oriented task title (max 10 words)",
  "description": "A concise, detailed summary of the problem or request. Include the nature of the issue, steps to reproduce (if applicable), expected vs. actual behavior, affected components or features, and any relevant technical or environment context."
}

Important Instructions:
- If the input includes user mentions using \`@\` (e.g., \`@test_user\`), do not include these in either the title or description. These are used for assignment purposes and are handled separately by the frontend.
- If the input includes something like "assign to @username", treat it the same way — do not reference it in the title or description.
- Focus only on the core issue or request described.
- If the input is unclear, unrelated to software tasks, or lacks sufficient detail, still respond with a valid JSON object. Use the title: "Clarify user request". In the description, politely ask the user to clarify or rephrase their input to describe a bug, feature request, or issue more clearly.

Only respond with the JSON object.

User Input: ${userInput}
`,
  ENHANCE_DESCRIPTION_PROMPT: (description) => `
You are an AI writing assistant. Your task is to enhance and polish the following software task description to make it clearer, more concise, and professional. Keep the meaning intact and avoid adding unrelated content.

Return only a JSON object like this:
\`\`\`json
{
  "description": "Your improved version of the input description"
}
\`\`\`

Input Description:
${description}
`
};


