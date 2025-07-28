import express from 'express';
import { generateText } from '../controllers/aiController.js';

const router = express.Router();

// POST /generate route
router.post('/generate', generateText);

export default router;
