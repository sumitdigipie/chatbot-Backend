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
You are an AI assistant helping software teams enhance task descriptions for issues, bugs, or feature requests.

Your job is to improve the following description while staying true to its original context and content. You should:

- Ensure clarity, completeness, and professionalism.
- Make the description easy to understand and actionable by a developer unfamiliar with the issue.
- Limit the length to **200–300 words**, unless the original input is too brief (then elaborate only as needed based on the provided context).
- **Do not invent or assume missing technical details or environment data.**
- **Do not add boilerplate or speculative debugging checklists unless such content is explicitly mentioned in the original input.**
- Use clear, structured writing: start with context, explain the issue or request, include any reproduction steps (if applicable), and contrast expected vs. actual behavior.
- Avoid referencing user mentions (e.g., @username) or assignment directives.

Return only a JSON object in the following format:

\`\`\`json
{
  "description": "Your improved version of the input description"
}
\`\`\`

Input Description:
${description}
`

};


