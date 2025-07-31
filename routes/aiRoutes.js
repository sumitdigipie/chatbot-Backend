import express from 'express';
import { enhanceText, generateText } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', generateText);
router.post('/enhance-description', enhanceText);

export default router;

