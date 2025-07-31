import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createTaskHandler, subtractTwoNumber } from "./helper.js";
import db from "./config/firebaseAdmin.js"

const server = new McpServer({
  name: "Task Management",
  version: "1.0.0"
});

async function getUniqueSectionStatuses() {
  try {
    const snapshot = await db.collection("sections").get();
    const statuses = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status) {
        statuses.add(data.status);
      }
    });

    return Array.from(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return [];
  }
}

const rawStatuses = await getUniqueSectionStatuses();

const statusValues = rawStatuses;

const statusSchema = z.string().transform((val, ctx) => {
  if (typeof val !== "string") {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: "string",
      received: typeof val,
    });
    return z.NEVER;
  }

  const matched = statusValues.find(s => s.toLowerCase() === val.toLowerCase());

  if (!matched) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_enum_value,
      options: statusValues,
      received: val,
      message: `Invalid status. Expected one of: ${statusValues.join(", ")}`,
    });
    return z.NEVER;
  }

  return matched;
});

const tools = {
  createTask: {
    title: "Task Creation Tool",
    description: "Create a new task with a title, description, assignee, and status.",
    inputSchema: {
      title: z.string(),
      description: z.string(),
      assignee: z.string(),
      status: statusSchema,
    },
    handler: createTaskHandler
  },
  updateTask: {
    title: "Subtraction Tool",
    description: "Subtracts second number from first",
    inputSchema: {
      a: z.number(),
      b: z.number()
    },
    handler: subtractTwoNumber
  }
};

for (const [name, tool] of Object.entries(tools)) {
  server.registerTool(name, {
    title: tool.title,
    description: tool.description,
    inputSchema: tool.inputSchema
  }, tool.handler);
}

export default {
  server,
  tools
};
