import express from "express";
import { handlePromptWithTools } from "../mcpClient.js";
import mcpTools from "../mcpTools.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await handlePromptWithTools(prompt, mcpTools.tools);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;