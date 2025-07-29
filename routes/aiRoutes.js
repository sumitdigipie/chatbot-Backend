import express from 'express';
import { enhanceText, generateText } from '../controllers/aiController.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'AI routes working!' });
});

router.post('/generate', generateText);
router.post('/enhance-description', enhanceText);

export default router;

