import { QuizResult } from '../models/QuizResult.js';
import { StudySession } from '../models/StudySession.js';

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const calculateStreak = (sessionDates = []) => {
  if (!sessionDates.length) return 0;
  const days = new Set(sessionDates.map((date) => getStartOfDay(date).toISOString()));
  let streak = 0;
  let cursor = getStartOfDay();

  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const getProgressSummary = async (req, res, next) => {
  try {
    const { userId = 'demo-user' } = req.query;

    const [recentQuizzes, totalQuizCount, recentSessions] = await Promise.all([
      QuizResult.find({ userId }).sort({ createdAt: -1 }).limit(10),
      QuizResult.countDocuments({ userId }),
      StudySession.find({ userId, completedAt: { $gte: getStartOfDay(new Date(Date.now() - 7 * 86400000)) } }),
    ]);

    const averageScore = recentQuizzes.length
      ? Math.round(recentQuizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / recentQuizzes.length)
      : 0;

    const topicMap = recentQuizzes.reduce((acc, quiz) => {
      acc[quiz.topic] = acc[quiz.topic] || { attempts: 0, average: 0 };
      acc[quiz.topic].attempts += 1;
      acc[quiz.topic].average += quiz.percentage;
      return acc;
    }, {});

    const topTopics = Object.entries(topicMap)
      .map(([topic, data]) => ({ topic, average: Math.round(data.average / data.attempts) }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);

    const streakDays = calculateStreak(recentSessions.map((session) => session.completedAt));
    const todaysMinutes = recentSessions
      .filter((session) => getStartOfDay(session.completedAt).getTime() === getStartOfDay().getTime())
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    const weeklyChart = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - index));
      const minutes = recentSessions
        .filter((session) => getStartOfDay(session.completedAt).getTime() === getStartOfDay(day).getTime())
        .reduce((sum, session) => sum + session.durationMinutes, 0);
      return { label: day.toLocaleDateString('en-US', { weekday: 'short' }), minutes };
    });

    res.json({
      totalQuizzes: totalQuizCount,
      averageScore,
      streakDays,
      todaysMinutes,
      topTopics,
      weeklyChart,
    });
  } catch (error) {
    next(error);
  }
};
