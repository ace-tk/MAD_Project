import { API_BASE_URL, DEFAULT_USER_ID } from '../config/constants';

const request = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error('Failed to fetch progress summary');
  }
  return response.json();
};

const FALLBACK_SUMMARY = {
  totalQuizzes: 0,
  averageScore: 0,
  streakDays: 0,
  todaysMinutes: 0,
  topTopics: [],
  weeklyChart: [
    { label: 'Mon', minutes: 0 },
    { label: 'Tue', minutes: 0 },
    { label: 'Wed', minutes: 0 },
    { label: 'Thu', minutes: 0 },
    { label: 'Fri', minutes: 0 },
    { label: 'Sat', minutes: 0 },
    { label: 'Sun', minutes: 0 },
  ],
};

export const fetchProgressSummary = async (userId = DEFAULT_USER_ID) => {
  try {
    return await request(`/api/progress/summary?userId=${userId}`);
  } catch (error) {
    console.warn('Using fallback progress summary:', error.message);
    return FALLBACK_SUMMARY;
  }
};
