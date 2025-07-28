import express from 'express';

const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'AI routes working!' });
});

// Import controller after router creation
import { generateText } from '../controllers/aiController.js';

// POST /generate route
router.post('/generate', generateText);

export default router;
