import { Router } from 'express';
import { generateQuiz, saveQuizResult } from '../controllers/quizController.js';

const router = Router();

router.post('/generate', generateQuiz);
router.post('/results', saveQuizResult);

export default router;
