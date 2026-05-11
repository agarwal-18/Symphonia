import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAISuggestions, analyzeAudio } from '../controllers/aiController.js';

const router = express.Router();

router.use(authenticate);

router.post('/suggestions', getAISuggestions);
router.post('/analyze', analyzeAudio);

export default router;
