import express from 'express';
const router = express.Router();
import { generateText } from '../controllers/aiController.js';

router.post('/generate', generateText);

export default router;
