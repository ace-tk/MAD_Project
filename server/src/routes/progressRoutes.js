import { Router } from 'express';
import { getProgressSummary } from '../controllers/progressController.js';

const router = Router();

router.get('/summary', getProgressSummary);

export default router;
