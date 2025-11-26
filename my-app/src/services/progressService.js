import { API_BASE_URL, DEFAULT_USER_ID } from '../config/constants';

const request = async (path) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error('Failed to fetch progress summary');
    }
    return response.json();
  } catch (error) {
    // Network errors (like localhost on mobile) should be caught
    throw error;
  }
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
  // If no API URL is configured, return fallback data immediately (offline mode)
  if (!API_BASE_URL) {
    return FALLBACK_SUMMARY;
  }
  
  try {
    return await request(`/api/progress/summary?userId=${userId}`);
  } catch (error) {
    console.warn('Using fallback progress summary:', error.message);
    return FALLBACK_SUMMARY;
  }
};

