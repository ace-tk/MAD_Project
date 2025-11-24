import { API_BASE_URL, DEFAULT_USER_ID } from '../config/constants';

const getFallbackQuestions = (topic = 'javascript', numQuestions = 5) => {
  const bank = {
    javascript: [
      {
        question: 'Which method adds an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'concat()'],
        correctAnswer: 0,
        explanation: 'push() mutates the array by appending the supplied item(s).',
      },
      {
        question: 'What does const declare?',
        options: ['Block-scoped constant', 'Function-scoped constant', 'Class property', 'Module import'],
        correctAnswer: 0,
        explanation: 'const creates a block-scoped binding that cannot be reassigned.',
      },
    ],
    react: [
      {
        question: 'What hook replaces componentDidMount?',
        options: ['useEffect', 'useState', 'useMemo', 'useContext'],
        correctAnswer: 0,
        explanation: 'useEffect lets you run side-effects after render.',
      },
    ],
  };

  const normalized = topic.trim().toLowerCase();
  const pool = bank[normalized] || bank.javascript;
  return pool.slice(0, numQuestions);
};

const request = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json();
};

export const generateQuiz = async (
  topic,
  numQuestions = 5,
  difficulty = 'medium',
  previousPerformance = [],
  userId = DEFAULT_USER_ID
) => {
  if (!topic) {
    return [];
  }

  const performanceSummary = previousPerformance.length
    ? {
        attempts: previousPerformance.length,
        averageScore:
          previousPerformance.reduce((sum, quiz) => sum + quiz.percentage, 0) /
          previousPerformance.length,
      }
    : { attempts: 0, averageScore: 0 };

  try {
    const payload = await request('/api/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, numQuestions, difficulty, userId, performanceSummary }),
    });
    return payload.questions ?? getFallbackQuestions(topic, numQuestions);
  } catch (error) {
    console.warn('Falling back to offline quiz data:', error.message);
    return getFallbackQuestions(topic, numQuestions);
  }
};

export const saveQuizPerformance = async ({
  topic,
  difficulty,
  responses,
  userId = DEFAULT_USER_ID,
}) => {
  if (!responses?.length) return null;

  try {
    const payload = await request('/api/quizzes/results', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty, responses, userId }),
    });
    return payload.data;
  } catch (error) {
    console.warn('Unable to persist quiz performance:', error.message);
    return null;
  }
};
