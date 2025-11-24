import { QuizResult } from '../models/QuizResult.js';
import { generateQuestionsWithAI } from '../services/openaiService.js';
import { getFallbackQuestions } from '../utils/fallbackQuestions.js';

const summarizePerformance = async (userId) => {
  const lastAttempts = await QuizResult.find({ userId }).sort({ createdAt: -1 }).limit(5);

  if (!lastAttempts.length) {
    return { averageScore: 0, difficulty: 'medium', attempts: 0 };
  }

  const averageScore =
    lastAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / lastAttempts.length;

  let recommendedDifficulty = 'medium';
  if (averageScore >= 85) recommendedDifficulty = 'hard';
  else if (averageScore < 60) recommendedDifficulty = 'easy';

  return {
    averageScore: Math.round(averageScore),
    difficulty: recommendedDifficulty,
    attempts: lastAttempts.length,
  };
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { topic, numQuestions = 5, difficulty = 'medium', userId = 'demo-user' } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const performanceSummary = await summarizePerformance(userId);
    const targetDifficulty = difficulty || performanceSummary.difficulty;

    const questions = await generateQuestionsWithAI({
      topic,
      difficulty: targetDifficulty,
      numQuestions,
      performanceSummary,
    });

    return res.json({
      topic,
      difficulty: targetDifficulty,
      questions: questions.length ? questions : getFallbackQuestions(topic, numQuestions),
    });
  } catch (error) {
    next(error);
  }
};

export const saveQuizResult = async (req, res, next) => {
  try {
    const { userId = 'demo-user', topic, difficulty, responses = [] } = req.body;

    if (!topic || !responses.length) {
      return res.status(400).json({ message: 'Topic and responses are required' });
    }

    const totalQuestions = responses.length;
    const correctAnswers = responses.filter((item) => item.isCorrect).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const result = await QuizResult.create({
      userId,
      topic,
      difficulty,
      score: correctAnswers,
      totalQuestions,
      percentage,
      questions: responses,
    });

    return res.status(201).json({
      message: 'Quiz result saved',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
