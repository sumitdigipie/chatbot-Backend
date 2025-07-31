import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function formatInputSchema(inputSchema) {
  return Object.entries(inputSchema)
    .map(([key, val]) => `- ${key}: ${val._def.typeName}`)
    .join('\n');
}

export async function handlePromptWithTools(prompt, tools) {
  const toolList = Object.entries(tools).map(([name, tool]) => ({
    name,
    title: tool.title,
    description: tool.description,
    inputSchema: tool.inputSchema
  }));
  const toolDescriptions = toolList.map(t => {
    return `${t.name}:\n${t.title} - ${t.description}\nExpected inputs:\n${formatInputSchema(t.inputSchema)}\n`;
  }).join('\n');


  const systemPrompt = `
You are an intelligent AI assistant designed exclusively for task management, similar to tools like Asana or Jira.

Your job is to understand user prompts and map them accurately to one of the predefined tools listed below.

## Available Tools:
\${toolDescriptions}

---

## Instructions:
- Determine the most appropriate tool based on the user prompt.
- Extract and structure only the **required inputs** defined in the selected tool's input schema.
- If the schema includes a \`description\` field:
  - Generate a clear, professional task description
  - It must be strictly based on the user's prompt
  - The description must be between **120 to 150 words**
  - Use complete sentences and proper formatting
- If the \`assignee\` field is included and the name starts with \`@\`, strip the \`@\` symbol and use only the name.
- Respond **strictly** in the following JSON format:

{
  "tool": "<toolName>",
  "input": {
    // input fields as per the selected tool's schema
  }
}

---

## Guidelines:
- Do NOT explain your reasoning.
- Do NOT include any text outside the JSON block.
- Only use tools from the list above.
- If the user prompt is unrelated to task management (e.g. questions about money, advice, general knowledge), respond with:

{
  "error": "No matching tool found for the given prompt. This assistant is only for task management-related queries."
}

---

## Example:

User prompt: "Create task where login page onclick of login button is not working and assign to @hello sumit and mark as completed."

Response:
{
  "tool": "createTask",
  "input": {
    "title": "Login Button Issue",
    "description": "The login page currently has a critical issue where the login button does not respond when clicked. As a result, users are unable to proceed with the authentication process, effectively preventing access to the platform. This issue has been observed across multiple browsers and devices, suggesting the problem may lie within the front-end JavaScript or event-handling logic. This task requires immediate attention to diagnose the cause, apply a fix, and test the login functionality to ensure a seamless user experience. Additionally, QA should validate the fix under multiple conditions to confirm the issue is fully resolved. The task should be marked completed upon successful verification and deployment.",
    "assignee": "hello sumit",
    "status": "completed"
  }
}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent([systemPrompt, prompt]);
  const response = await result.response;
  const rawText = await response.text();

  const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonStr = match ? match[1] : rawText;

  let parsed;
  try {
    parsed = JSON.parse(jsonStr.trim());
  } catch (e) {
    throw new Error("Failed to parse Gemini response: " + rawText);
  }

  const { tool, input } = parsed;
  const selectedTool = tools[tool];

  if (!selectedTool) throw new Error(`Unknown tool: ${tool}`);

  const schema = z.object(selectedTool.inputSchema);
  const validatedInput = schema.parse(input);

  const resultValue = await selectedTool.handler(validatedInput);

  return { tool, input: validatedInput, result: resultValue };
}