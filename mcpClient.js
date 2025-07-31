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
You are an intelligent AI assistant that can process user requests and map them to predefined tools.

## Available Tools:
${toolDescriptions}

## Instructions:
- Based on the user prompt, determine the most appropriate tool from the list above.
- Extract and structure only the **required inputs** as defined in the tool's input schema.
- Respond strictly in the following JSON format:

{
  "tool": "<toolName>",
  "input": {
    // input fields as per the selected tool's schema
  }
}

## Guidelines:
- Do not explain your reasoning.
- Do not include any extra text outside of the JSON block.
- Only use tools listed above. If the input doesn’t match any tool, respond with an error JSON like:
  {
    "error": "No matching tool found for the given prompt."
  }

## Example:

User prompt: "Create task where login page onclick of login button is not working and assign to hello sumit and mark as completed."

Response:
{
  "tool": "createTask",
  "input": {
    "title": "Login Button Issue",
    "description": "The login button on the login page does not work when clicked.",
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