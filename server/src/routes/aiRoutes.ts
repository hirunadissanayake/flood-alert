import express from 'express';
import { generateSummary, generateWarningMessage, generateDailySummary, generateEmergencyMessage } from '../controllers/aiController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.post('/summary', protect, admin, generateSummary);
router.post('/warning-message', protect, admin, generateWarningMessage);
router.get('/daily-summary', protect, admin, generateDailySummary);
router.post('/emergency-message', protect, admin, generateEmergencyMessage);

export default router;
