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
You are an AI writing assistant designed to help software teams improve the clarity and completeness of task descriptions.

Your objective is to rewrite the following task description to ensure it is:
- Clear, concise, and professional.
- Easy for a new developer to understand and act on with minimal follow-up.
- Between **200 and 300 words**, unless the original content clearly lacks detail (in which case you may elaborate reasonably based on typical technical standards).
- Focused on retaining the core intent and facts without adding fictional or speculative content.
- Free of jargon unless necessary, and if technical terms are included, make sure they are clearly contextualized.

You should:
- Clarify vague wording or incomplete thoughts.
- Organize the information logically: start with the context, then describe the issue/request, followed by steps to reproduce (if applicable), and expected vs. actual behavior.
- Include any relevant technical or environment details mentioned (e.g., affected platform, component, browser, version).
- Avoid referencing user mentions (e.g., @username) or assignment-related phrases.

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


